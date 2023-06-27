import { VolumeAction } from "./utils";
import { ADJUST_STEP } from "./constants";
import { exec, Speaker, VolumeInfo } from "./speaker";
import { Cache } from "@raycast/api";

const cache = new Cache();

export class ExternalSpeaker implements Speaker {

    async consumeQueue() {
        const queueVol = this.getCache("queue");
        if (queueVol == undefined) return;
        await exec("/usr/local/bin/m1ddc", ["set", "volume", queueVol])
    }

    async adjustVolume(action: VolumeAction): Promise<VolumeInfo> {
        if (action == VolumeAction.ToggleMute) {
            let muted = this.getCache("isMuted") || "false";
            muted = muted == "false" ? "true" : "false";
            await exec("/usr/local/bin/m1ddc", ["set", "mute", muted == "true" ? "on" : "off"]);
            this.setCache("isMuted", muted);
            return {isMuted: muted == "true", volume: this.getVolume()};
        }


        let vol = Number(this.getVolume());
        console.log("vol = " + JSON.stringify(vol, null, 2));
        if (isNaN(vol)) {
            console.log("abnormal volume: "  + vol.toString())
            return { isMuted: false, volume: 0, error: "abnormal volume: "  + vol.toString()}
        }
        vol += this.getIncrementStep(action);
        this.setCache("lastUpdateTime", Date.now().toString());
        vol = Math.min(100, Math.max(0, vol));


        if (this.getCache("queue") == undefined) {
            this.setCache("queue", vol.toString());
            await this.consumeQueue();
        } else {
            console.log(2);
            this.setCache("queue", vol.toString());
            await this.consumeQueue();
            // setTimeout(async () => {
            //     await this.consumeQueue();
            // }, 1000)
        }
        // console.log(`set to ${vol}`);
        this.setCache('volume', vol.toString());
        if (vol != 0) {
            this.setCache("isMuted", false.toString());
        }
        return {isMuted: false, volume: vol};
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

    private getIncrementStep(action: VolumeAction) {
        let delta = 0;

        switch (action) {
            case VolumeAction.Up:
                delta = ADJUST_STEP
                break;
            case VolumeAction.Down:
                delta = -ADJUST_STEP
                break;
        }

        const lastUpdateTime = this.getCache('lastUpdateTime')
        if (lastUpdateTime) {
            if (Date.now() - Number(lastUpdateTime) < 0.2*1000) {
                delta *= 2
            }
        }

        console.log("delta = " + JSON.stringify(delta, null, 2));

        return delta;
    }
}
