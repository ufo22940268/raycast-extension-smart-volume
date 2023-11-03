import { m1ddc, updateVolume } from "./utils";

async function getVolume() {
  const muted = await m1ddc(["get", "mute"]) == '1'
  if (muted) return 0;
  return await m1ddc(["get", "volume"])
}

export default async () => {
  const volume = await getVolume();
  const vol = Number(volume);
  await updateVolume(vol);
}
