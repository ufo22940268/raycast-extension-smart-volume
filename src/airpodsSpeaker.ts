import { Speaker } from "./speaker";
import { runAppleScript } from "run-applescript";
import { VolumeAction } from "./script";
import { ADJUST_STEP } from "./constants";

export class AirpodsSpeaker implements Speaker {
    cache = -1
    async adjustVolume(action: VolumeAction) {
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
    }

    async getVolume() {
        return this.cache;
    }

}
