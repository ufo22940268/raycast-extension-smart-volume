import { m1ddc, updateVolume } from "./utils";

async function getVolume() {
  const vol = await m1ddc(["get", "volume"]);
  const muted = await m1ddc(["get", "mute"]) == '1'
  if (muted) return 0;
  return vol
}

export default async () => {
  const volume = await getVolume();
  const vol = Number(volume);
  console.log(vol);
  await updateVolume(vol);
}
