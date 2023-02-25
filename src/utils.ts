import { getDefaultOutputDevice } from "./audioDevice";
import { ExternalSpeaker } from "./externalSpeaker";
import { exec, Speaker } from "./speaker";
import { InternalSpeaker } from "./internalSpeaker";
import path from "path";
import { environment, launchCommand, LaunchType } from "@raycast/api";
import fs from "fs";
import { execa } from "execa";

export enum VolumeAction {
  Up,
  Down,
  ToggleMute,
}

export const externalSpeaker = new ExternalSpeaker();
const internalSpeaker = new InternalSpeaker();

export async function getActiveDevice(): Promise<Speaker> {
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
