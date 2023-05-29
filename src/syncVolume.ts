import { m1ddc, updateVolume } from "./utils";

async function getVolume() {
  return await m1ddc(["get", "volume"])
}

export default async () => {
  const volume = await getVolume();
  if (isNaN(Number(volume))) {
    const vol = Number(volume);
    await updateVolume(vol);
  } else {
    throw new Error(`error get volume: ${volume}`);
  }
}
