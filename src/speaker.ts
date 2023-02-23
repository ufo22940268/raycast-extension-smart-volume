import {VolumeAction} from "./script";

export interface Speaker {
    adjustVolume(action: VolumeAction): any

    getVolume(): Promise<number>;
}
