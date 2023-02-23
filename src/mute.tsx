import {showHUD} from "@raycast/api";
import { adjustVolume, getActiveDevice, getVolume, VolumeAction } from "./utils";

export default async function Command() {
  const isMuted = await adjustVolume(VolumeAction.ToggleMute);
  const msg = isMuted ? "🔇" : "🔉";
  await showHUD(msg);
}
