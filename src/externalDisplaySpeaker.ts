import { VolumeAction } from "./utils";
import { ADJUST_STEP } from "./constants";
import { exec, Speaker } from "./speaker";
import { Cache } from "@raycast/api";

const cache = new Cache();

export class ExternalDisplaySpeaker implements Speaker {

    volume = -1;
    async adjustVolume(action: VolumeAction): Promise<boolean | number> {
        if (action == VolumeAction.ToggleMute) {
            let muted = this.getCache("isMuted") || 'off';
            muted = muted == "on" ? "off" : "on";
            await exec("/usr/local/bin/m1ddc", ["set", "mute", muted]);
            this.setCache("isMuted", muted);
            return muted == 'on';
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
        return this.volume;
    }

    setCache(key: string, value: string) {
        cache.set(`external:${key}`, value);
    }

    getCache(key: string) {
        return cache.get(`external:${key}`)
    }


    async getVolume(): Promise<number> {
        return Promise.resolve(this.volume);
    }
}
