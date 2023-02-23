import {showHUD} from "@raycast/api";
import {adjustVolume, getVolume, VolumeAction} from "./utils";

export default async function Command() {
  await adjustVolume(VolumeAction.Up);
  await showHUD(`🔊 Volume set to ${await getVolume()}%`);
}
