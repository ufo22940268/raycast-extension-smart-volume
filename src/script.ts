import { getDefaultOutputDevice } from "./audioDevice";
import { ExternalDisplaySpeaker } from "./externalDisplaySpeaker";
import { Speaker } from "./speaker";
import { AirpodsSpeaker } from "./airpodsSpeaker";

export enum VolumeAction {
  Up,
  Down,
  // Mute,
}

const externalDisplaySpeaker = new ExternalDisplaySpeaker();
const airpodsSpeaker = new AirpodsSpeaker();

async function getActiveDevice(): Promise<Speaker> {
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
