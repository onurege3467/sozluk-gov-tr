export interface TdkLookupResult {
  /** Kelimenin kendisi (TDK'daki standart yazılış) */
  word: string;
  /** İlk anlamı */
  meaning: string | null;
  /** Tüm anlamları */
  meanings: string[];
  /** Kelimenin köken dili (örn: "İngilizce", "Arapça") */
  language: string | null;
  /** Birleşik kelimeler */
  compoundWords: string[];
  /** Kelimeyle ilgili atasözleri */
  proverbs: string[];
}
