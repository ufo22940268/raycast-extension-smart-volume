import { Speaker } from "./speaker";
import { runAppleScript } from "run-applescript";
import { VolumeAction } from "./utils";
import { ADJUST_STEP } from "./constants";

export class AirpodsSpeaker implements Speaker {
    cache = -1
    async adjustVolume(action: VolumeAction) {
        if (action == VolumeAction.ToggleMute) {
            const muteScript = `set curVolume to get volume settings
if output muted of curVolume is false then
\tset volume with output muted
else
\tset volume without output muted
end if
 return output muted of curVolume`;
            const r = await runAppleScript(muteScript)
            return r == "false";
        }

        let delta: string;
        switch (action) {
            case VolumeAction.Up:
                delta = `+ ${ADJUST_STEP}`;
                break;
            case VolumeAction.Down:
                delta = `- ${ADJUST_STEP}`;
                break;
        }

        const newVolume = await runAppleScript(`set volume output volume ((output volume of (get volume settings)) ${delta})
        return output volume of (get volume settings)
        `);
        this.cache = Number.parseInt(newVolume);
        return this.cache;
    }

    async getVolume() {
        return this.cache;
    }
}
