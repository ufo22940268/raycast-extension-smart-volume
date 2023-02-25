import { adjustVolume, getVolume, refreshMenubar, showVolume, VolumeAction } from "./utils";
import { ABNORMAL_VOLUME } from "./constants";

export default async function Command() {
  await adjustVolume(VolumeAction.Up);
  const vol = await getVolume();
  if (vol == ABNORMAL_VOLUME) return;
  await showVolume(vol);
  await refreshMenubar();
}
