import { TdkService } from "./service.js";

export { TdkService } from "./service.js";
export type { TdkLookupResult } from "./types.js";

/** Singleton instance — çoğu kullanım için yeterlidir */
export const tdkService = new TdkService();
