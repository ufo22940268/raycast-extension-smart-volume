import { adjustVolume, updateVolumeDisplay, VolumeAction } from "./utils";

export default async function Command() {
  await adjustVolume(VolumeAction.Up);
  await updateVolumeDisplay();
}
