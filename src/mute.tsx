import { adjustVolume, updateVolumeDisplay, VolumeAction } from "./utils";

export default async function Command() {
  const vol = await adjustVolume(VolumeAction.ToggleMute);
  if (vol.error) return;
  await updateVolumeDisplay(vol);
}
