import { getPreferenceValues } from "@raycast/api";

export const ADJUST_STEP = (() => {
  return Number.parseInt(getPreferenceValues()["volume_step"]);
})();
export const ABNORMAL_VOLUME = -92;
