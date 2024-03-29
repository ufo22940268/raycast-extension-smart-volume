import { adjustVolume, updateVolumeDisplay, VolumeAction } from "./utils";

export default async function Command() {
  console.log('up');
  const vol = await adjustVolume(VolumeAction.Up);
  if (vol.error) return;
  await updateVolumeDisplay(vol);
}
