import { adjustVolume, updateVolumeDisplay, VolumeAction } from "./utils";

export default async function Command() {
  console.log('down');
  const vol = await adjustVolume(VolumeAction.Down);
  await updateVolumeDisplay(vol);
}
