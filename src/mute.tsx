import { adjustVolume, updateVolumeDisplay, VolumeAction } from "./utils";

export default async function Command() {
  const vol = await adjustVolume(VolumeAction.ToggleMute);
  await updateVolumeDisplay(vol);
}
