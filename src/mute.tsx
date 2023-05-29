import { adjustVolume, getVolume, refreshMenubar, showMuted, showVolume, updateVolume, VolumeAction } from "./utils";

export default async function Command() {
  const isMuted = (await adjustVolume(VolumeAction.ToggleMute)) as boolean;
  if (isMuted) {
    await showMuted(isMuted);
    await updateVolume(0);
  } else {
    const vol = await getVolume();
    await showVolume(vol);
    await updateVolume(vol);
  }
  await refreshMenubar();
}
