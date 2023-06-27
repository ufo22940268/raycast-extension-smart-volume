import { VolumeAction } from "./utils";
import { execa } from "execa";

export interface Speaker {
    adjustVolume(action: VolumeAction): Promise<VolumeInfo>;

    getVolume(): number;

    isMuted(): boolean;
}

export interface VolumeInfo {
    isMuted: boolean;
    volume: number;
    error?: string;
}

export async function exec(bin: string, args: (string | any)[]): Promise<string> {
    const { stdout, stderr } = await execa(bin, args);
    if (stderr) {
        throw new Error(stderr);
    }

    return stdout.toString();
}
