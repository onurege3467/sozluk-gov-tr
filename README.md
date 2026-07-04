# sozluk-gov-tr

[![npm version](https://img.shields.io/npm/v/sozluk-gov-tr.svg)](https://www.npmjs.com/package/sozluk-gov-tr)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)

> TDK (Türk Dil Kurumu) sözlük API client — `sozluk.gov.tr` üzerinden kelime sorgulama.

---

**⚠️ Bu paket TDK (Türk Dil Kurumu) ile resmî olarak bağlantılı değildir.** TDK'nın kamuya açık `sozluk.gov.tr` API'sini kullanan bağımsız bir istemcidir. TDK tarafından desteklenmez, onaylanmaz veya denetlenmez. API'deki değişiklikler bu paketin çalışmasını etkileyebilir.

---

## Kurulum

```bash
npm install sozluk-gov-tr
```

## Kullanım

### Singleton instance (önerilen)

```ts
import { tdkService } from "sozluk-gov-tr";

const result = await tdkService.lookup("kitap");
if (result) {
  console.log(result.word);        // "kitap"
  console.log(result.meaning);     // "Ciltli veya ciltsiz olarak bir araya getirilmiş..."
  console.log(result.meanings);    // tüm anlamlar
  console.log(result.language);    // "Arapça"
  console.log(result.compoundWords); // ["kitap açacağı", "kitap cebi", "kitap dolabı", ...]
  console.log(result.proverbs);    // ["kitaba (veya kitabına) uydurmak", ...]
}

// Sadece geçerlilik kontrolü
const valid = await tdkService.validate("merdiven"); // true
```

### Kendi instance

```ts
import { TdkService } from "sozluk-gov-tr";

const service = new TdkService();
const result = await service.lookup("bilgisayar");
```

## API

### `lookup(word: string): Promise<TdkLookupResult | null>`

Kelimeyi TDK'da sorgular. Bulunamazsa `null` döner.

**Dönen yapı:**

| Alan | Tip | Açıklama |
|------|-----|----------|
| `word` | `string` | Kelimenin TDK'daki standart yazılışı |
| `meaning` | `string \| null` | İlk anlamı (kısa yol) |
| `meanings` | `string[]` | Tüm anlamları |
| `language` | `string \| null` | Köken dili (örn: "Arapça", "Farsça", "İngilizce") |
| `compoundWords` | `string[]` | Kelimeyle oluşturulmuş birleşik kelimeler |
| `proverbs` | `string[]` | Kelimeyi içeren atasözleri ve deyimler |

### `validate(word: string): Promise<boolean>`

Kelimenin TDK'da olup olmadığını kontrol eder. `lookup()` ile aynı sorguyu yapar ama sadece `true/false` döner.

## Özellikler

- ✅ **Resmî bağlantı yok** — TDK ile ilişkili değildir, bağımsız istemcidir
- ✅ **Node 18+** — native `fetch` kullanır, ek HTTP bağımlılığı yok
- ✅ **ESM + CJS** — hem `import` hem `require` destekler
- ✅ **Zod doğrulama** — runtime tip güvenliği
- ✅ **In-memory cache** — 1 saat TTL, aynı kelime tekrar sorgulanmaz, process exit'i engellemez
- ✅ **TypeScript** — tam tip desteği (`.d.ts` + `.d.cts`)
- ✅ **Tek bağımlılık** — sadece `zod`

## Geliştirme

```bash
npm install        # bağımlılıkları yükle
npm run build      # build al
npm run build:check # tip kontrolü
```

Testler:

```bash
node test/esm.mjs      # ESM import testi
node test/cjs.cjs      # CJS require testi
node test/lookup.mjs   # canlı API sorgu testi
```

## Lisans

MIT
