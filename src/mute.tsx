import {showHUD} from "@raycast/api";
import {adjustVolume, getVolume, VolumeAction} from "./script";

export default async function Command() {
  await adjustVolume(VolumeAction.Mute);
  await showHUD(`🔊 Volume set to ${await getVolume()}%`);
}
