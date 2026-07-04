import { TdkErrorSchema, TdkResponseSchema } from "./schemas.js";
import type { TdkLookupResult } from "./types.js";

interface CacheEntry {
  timestamp: number;
  result: TdkLookupResult | null;
}

const BASE_URL = "https://sozluk.gov.tr";
const CACHE_TTL = 1000 * 60 * 60; // 1 saat
const CLEAN_INTERVAL = 1000 * 60 * 30; // 30 dk

export class TdkService {
  private cache = new Map<string, CacheEntry>();

  constructor() {
    const timer = setInterval(() => this.cleanCache(), CLEAN_INTERVAL);
    timer.unref();
  }

  /**
   * Bir kelimeyi TDK'da sorgular.
   * @returns TDK'da var → kelime bilgisi, yok → null
   */
  async lookup(word: string): Promise<TdkLookupResult | null> {
    const normalized = word.toLowerCase().trim();

    // Cache kontrol
    const cached = this.cache.get(normalized);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.result;
    }

    try {
      const url = `${BASE_URL}/gts?ara=${encodeURIComponent(normalized)}`;
      const response = await fetch(url, {
        headers: { "User-Agent": "sozluk-gov-tr/1.0" },
      });

      if (!response.ok) return null;

      const data: unknown = await response.json();

      // Hata yanıtı kontrol
      const error = TdkErrorSchema.safeParse(data);
      if (error.success) {
        this.cache.set(normalized, { timestamp: Date.now(), result: null });
        return null;
      }

      // Başarılı yanıt
      const parsed = TdkResponseSchema.parse(data);
      const entry = parsed[0];

      const result: TdkLookupResult = {
        word: entry.madde,
        meaning: entry.anlamlarListe?.[0]?.anlam ?? null,
        meanings: entry.anlamlarListe?.map((a) => a.anlam) ?? [],
        language: entry.lisan ?? null,
        compoundWords: entry.birlesikler
          ? entry.birlesikler.split(", ").map((s) => s.trim())
          : [],
        proverbs:
          entry.atasozu?.filter((a) => a.madde).map((a) => a.madde) ?? [],
      };

      this.cache.set(normalized, { timestamp: Date.now(), result });

      return result;
    } catch (err) {
      console.error(`[TDK] Sorgu hatası (${normalized}):`, err);
      return null;
    }
  }

  /**
   * Bir kelimenin TDK'da geçerli olup olmadığını kontrol eder.
   * `lookup()`'tan daha hafif, sadece boolean döner.
   */
  async validate(word: string): Promise<boolean> {
    const result = await this.lookup(word);
    return result !== null;
  }

  /** Cache'deki süresi dolmuş kayıtları temizler */
  private cleanCache(): void {
    const now = Date.now();
    for (const [key, val] of this.cache) {
      if (now - val.timestamp > CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }
}
