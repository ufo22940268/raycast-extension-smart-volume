import { Speaker } from "./speaker";
import { runAppleScript } from "run-applescript";
import { VolumeAction } from "./utils";
import { ADJUST_STEP } from "./constants";
import { Cache } from "@raycast/api";

const cache = new Cache();

export class AirpodsSpeaker implements Speaker {
    async adjustVolume(action: VolumeAction) {
        if (action == VolumeAction.ToggleMute) {
            const muteScript = `set curVolume to get volume settings
if output muted of curVolume is false then
\tset volume with output muted
else
\tset volume without output muted
end if
 return output muted of curVolume`;
            return await runAppleScript(muteScript) == "false";
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
        this.setCache("volume", newVolume);
        return Number.parseInt(newVolume);
    }

    setCache(key: string, value: string) {
        cache.set(`airpods:${key}`, value);
    }

    getCache(key: string) {
        return cache.get(`airpods:${key}`)
    }

    async getVolume() {
        return Number.parseInt(this.getCache("volume") as string);
    }
}
