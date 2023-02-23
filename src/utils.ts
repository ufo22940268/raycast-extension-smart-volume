import { getDefaultOutputDevice } from "./audioDevice";
import { ExternalDisplaySpeaker } from "./externalDisplaySpeaker";
import { Speaker } from "./speaker";
import { AirpodsSpeaker } from "./airpodsSpeaker";
import {Cache} from '@raycast/api'

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
