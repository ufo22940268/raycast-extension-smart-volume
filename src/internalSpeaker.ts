import { Speaker, VolumeInfo } from "./speaker";
import { runAppleScript } from "run-applescript";
import { VolumeAction } from "./utils";
import { ADJUST_STEP } from "./constants";
import { Cache } from "@raycast/api";

const cache = new Cache();

export class InternalSpeaker implements Speaker {
    async adjustVolume(action: VolumeAction): Promise<VolumeInfo> {
        if (action == VolumeAction.ToggleMute) {
            const muteScript = `set curVolume to get volume settings
if output muted of curVolume is false then
\tset volume with output muted
else
\tset volume without output muted
end if
 return output muted of curVolume`;
            const isMuted = await runAppleScript(muteScript) == "false"
            this.setCache("isMuted", isMuted.toString());
            return { isMuted, volume: this.getVolume() };
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
        return {isMuted: false, volume: Number.parseInt(newVolume)};
    }

    setCache(key: string, value: string) {
        cache.set(`internal:${key}`, value);
    }

    getCache(key: string) {
        return cache.get(`internal:${key}`)
    }

    getVolume() {
        return Number.parseInt(this.getCache("volume") as string);
    }

    isMuted(): boolean {
        return (this.getCache("isMuted") as string) == "true";
    }
}
