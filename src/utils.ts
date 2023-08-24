import { getDefaultOutputDevice } from "./audioDevice";
import { ExternalSpeaker } from "./externalSpeaker";
import { exec, Speaker, VolumeInfo } from "./speaker";
import { InternalSpeaker } from "./internalSpeaker";
import path from "path";
import { environment, launchCommand, LaunchType } from "@raycast/api";
import fs from "fs";
import { execa } from "execa";
import { ABNORMAL_VOLUME } from "./constants";


export enum VolumeAction {
  Up,
  Down,
  ToggleMute,
}

export const externalSpeaker = new ExternalSpeaker();
const internalSpeaker = new InternalSpeaker();

export async function getActiveDevice(): Promise<Speaker> {
  // return externalSpeaker
  const dev = await getDefaultOutputDevice();
  if (dev.transportType == "displayport") {
    return externalSpeaker;
  } else {
    return internalSpeaker;
  }
}

export const adjustVolume = async (action: VolumeAction) => {
  const speaker = await getActiveDevice()
  return speaker.adjustVolume(action);
};

export async function getVolume() {
  return (await getActiveDevice()).getVolume();
}

enum ActiveDeviceType {
  Internal, External
}
export async function getActiveDeviceType() {
  const dev = await getDefaultOutputDevice();
  if (dev.transportType == "displayport") {
    return ActiveDeviceType.External;
  } else {
    return ActiveDeviceType.Internal;
  }
}

const binaryAsset = path.join(environment.assetsPath, "showosd");
const binary = path.join(environment.supportPath, "showosd");

async function ensureBinary() {
  if (!fs.existsSync(binary)) {
    await execa("cp", [binaryAsset, binary]);
    await execa("chmod", ["+x", binary]);
  }
}
export async function showVolume(vol: number) {
  await ensureBinary();
  await exec(binary, ["volume", vol.toString()])
}

export async function showMuted(muted: boolean) {
  await ensureBinary();
  if (muted) {
    await exec(binary, ["mute"])
  } else {
    await exec(binary, ["volume"])
  }
}

export async function refreshMenubar() {
  await launchCommand({ name: "volumeMenu", type: LaunchType.Background });
}

export const m1ddc = async (command: string[]): Promise<string> => {
  const { stdout, stderr } = await execa("/usr/local/bin/m1ddc", command);
  if (stderr) {
    throw new Error("error m1ddc: " + stderr);
  }

  return stdout;
}

export const updateText = async (text: string) => {
  await execa("python3", ['/Users/chao.cheng/code/extensions/smart-volume/assets/cli.py', 'update_text', text]);
}

export async function updateLCDVolume(vol: number) {
  try {
    await updateText(vol.toString());
  } catch(e) {
    console.log("update lcd error:", e);
  }
}

export async function updateVolumeDisplay(volumeInfo: VolumeInfo) {
  const isMuted = volumeInfo.isMuted;
  const vol = volumeInfo.volume
  if (isMuted) {
    await showMuted(isMuted);
    await updateLCDVolume(0);
  } else {
    if (vol == ABNORMAL_VOLUME) {
      throw new Error("abnormal volume: " + vol);
    }
    await showVolume(vol);
    await updateLCDVolume(vol);
  }
  // await refreshMenubar();
}
