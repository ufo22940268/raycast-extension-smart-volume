import { externalSpeaker, m1ddc, updateLCDVolume } from "./utils";

async function getVolume() {
  const vol = await m1ddc(["get", "volume"]);
  const muted = await m1ddc(["get", "mute"]) == '1'
  if (muted) return 0;
  return vol
}

export default async () => {
  const volume = await getVolume();
  if (isNaN(Number(volume))) {
    throw new Error(`${volume} can't be converted to number`);
  }
  const vol = Number(volume);
  console.log(vol);
  externalSpeaker.setVolume('volume', vol)
  await updateLCDVolume(vol);
}
