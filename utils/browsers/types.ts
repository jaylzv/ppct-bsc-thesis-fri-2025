export enum BrowsersEnum {
  CHROMIUM = "chromium",
  FIREFOX = "firefox",
  WEBKIT = "webkit",
}
export type BrowsersType = `${BrowsersEnum}`;
export const BROWSERS: BrowsersType[] = Object.values(BrowsersEnum);
