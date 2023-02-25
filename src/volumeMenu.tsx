import { Icon, MenuBarExtra } from "@raycast/api";
import { externalDisplaySpeaker } from "./utils";

export default function Command() {
  const device = externalDisplaySpeaker;
  const vol = device.getVolume();
  const muted = device.isMuted();

  let icon;
  if (muted) {
    icon = Icon.SpeakerOff;
  } else if (vol > 50) {
    icon = Icon.SpeakerHigh;
  } else if (vol == 0) {
    icon = Icon.SpeakerOff;
  } else {
    icon = Icon.SpeakerLow;
  }

  return (
    <MenuBarExtra icon={icon} title={"speaker"}>
    </MenuBarExtra>
  );
}
