import { VolumeAction } from "./utils";
import { ADJUST_STEP } from "./constants";
import { exec, Speaker } from "./speaker";
import { Cache } from "@raycast/api";

const cache = new Cache();

export class ExternalSpeaker implements Speaker {

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
                delta = ADJUST_STEP
                break;
            case VolumeAction.Down:
                delta = -ADJUST_STEP
                break;
        }

        let vol = Number(this.getVolume());
        if (isNaN(vol)) vol = 0;
        vol += delta;
        vol = Math.min(100, Math.max(0, vol));
        console.log(vol);
        await exec("/usr/local/bin/m1ddc", ["set", "volume", vol.toString()])
        this.setCache('volume', vol.toString());
        if (vol != 0) {
            this.setCache("isMuted", false.toString());
        }
        return vol;
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

    setVolume(volume1: string, vol: number) {
        cache.set(`external:volume`, vol.toString());
    }
}
