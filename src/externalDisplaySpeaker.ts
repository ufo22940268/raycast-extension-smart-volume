import {execa} from "execa";
import {VolumeAction} from "./script";
import {ADJUST_STEP} from "./constants";
import {Speaker} from "./speaker";

export class ExternalDisplaySpeaker implements Speaker {

    cache = -1;
    async adjustVolume(action: VolumeAction) {
        let delta;

        switch (action) {
            case VolumeAction.Up:
                delta = `+${ADJUST_STEP}`
                break;
            case VolumeAction.Down:
                delta = `-${ADJUST_STEP}`;
                break;
        }
        const {stdout, stderr} = await execa("/usr/local/bin/m1ddc", ["chg", "volume", delta])
        if (stderr) throw new Error(stderr);
        this.cache = Number.parseInt(stdout);
    }


    async getVolume(): Promise<number> {
        return Promise.resolve(this.cache);
    }
}
