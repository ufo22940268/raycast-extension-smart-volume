import { VolumeAction } from "./utils";
import { ADJUST_STEP } from "./constants";
import { exec, Speaker } from "./speaker";
import { Cache } from "@raycast/api";

const cache = new Cache();

export class ExternalDisplaySpeaker implements Speaker {

    async adjustVolume(action: VolumeAction): Promise<boolean | number> {
        if (action == VolumeAction.ToggleMute) {
            let muted = this.getCache("isMuted") || "false";
            muted = muted == "false" ? "true" : "false";
            await exec("/usr/local/bin/m1ddc", ["set", "mute", muted == "true" ? "on" : "off"]);
            this.setCache("isMuted", muted);
            return muted == "true";
        }

        let delta;

        switch (action) {
            case VolumeAction.Up:
                delta = `+${ADJUST_STEP}`
                break;
            case VolumeAction.Down:
                delta = `-${ADJUST_STEP}`;
                break;
        }
        const stdout = await exec("/usr/local/bin/m1ddc", ["chg", "volume", delta])
        this.setCache('volume', stdout);
        return Number.parseInt(stdout);
    }

    setCache(key: string, value: string) {
        cache.set(`external:${key}`, value);
    }

    getCache(key: string) {
        return cache.get(`external:${key}`);
    }

    getVolume(): number {
        return Number.parseInt(this.getCache("volume") as string);
    }

    isMuted(): boolean {
        return (this.getCache("isMuted") as string) == "true";
    }
}
