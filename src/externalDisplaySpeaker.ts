import {execa} from "execa";
import {VolumeAction} from "./script";
import {ADJUST_STEP} from "./constants";
import {Speaker} from "./speaker";

export class ExternalDisplaySpeaker implements Speaker {
    async adjustVolume(action: VolumeAction) {
        let vol = await this.getVolume();
        switch (action) {
            case VolumeAction.Up:
                vol += ADJUST_STEP;
                break;
            case VolumeAction.Down:
                vol -= ADJUST_STEP;
                break;
        }
        vol = Math.floor(vol / 10 + 0.5) * 10;
        await execa("/usr/local/bin/m1ddc", ["set", "volume", vol.toString()])
    }

    async getVolume(): Promise<number> {
        const {stdout, stderr} = await execa("/usr/local/bin/m1ddc", ["get", "volume"]);
        if (stderr) return Promise.reject(stderr);
        return Number.parseInt(stdout);
    }
}
