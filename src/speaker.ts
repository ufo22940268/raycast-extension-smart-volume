import { VolumeAction } from "./utils";
import { execa } from "execa";

export interface Speaker {
    adjustVolume(action: VolumeAction): Promise<boolean | number>

    getVolume(): Promise<number>;
}

export async function exec(bin: string, args: (string | any)[]): Promise<string> {
    const { stdout, stderr } = await execa(bin, args);
    if (stderr) {
        throw new Error(stderr);
    }

    return stdout.toString();
}
