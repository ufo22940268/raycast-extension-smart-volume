import { adjustVolume, updateVolumeDisplay, VolumeAction } from "./utils";

export default async function Command() {
  console.log('down');
  const vol = await adjustVolume(VolumeAction.Down);
  if (vol.error) return;
  await updateVolumeDisplay(vol);
}
