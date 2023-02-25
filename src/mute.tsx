import { adjustVolume, getVolume, refreshMenubar, showMuted, showVolume, VolumeAction } from "./utils";

export default async function Command() {
  const isMuted = (await adjustVolume(VolumeAction.ToggleMute)) as boolean;
  if (isMuted) {
    await showMuted(isMuted);
  } else {
    await showVolume(await getVolume());
  }
  await refreshMenubar();
}
