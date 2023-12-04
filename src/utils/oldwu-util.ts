export function isJsonString(val: string): boolean {
  try {
    JSON.parse(val);
    return true;
  } catch (e) {
    return false;
  }
}
