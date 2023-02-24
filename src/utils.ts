import { getDefaultOutputDevice } from "./audioDevice";
import { ExternalDisplaySpeaker } from "./externalDisplaySpeaker";
import { exec, Speaker } from "./speaker";
import { AirpodsSpeaker } from "./airpodsSpeaker";
import path from "path";
import { environment } from "@raycast/api";
import fs from "fs";
import { execa } from "execa";

export enum VolumeAction {
  Up,
  Down,
  ToggleMute,
}

const externalDisplaySpeaker = new ExternalDisplaySpeaker();
const airpodsSpeaker = new AirpodsSpeaker();

export async function getActiveDevice(): Promise<Speaker> {
  const dev = await getDefaultOutputDevice();
  if (dev.transportType == "displayport") {
    return externalDisplaySpeaker;
  } else {
    return airpodsSpeaker;
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
