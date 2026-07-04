import { tdkService } from "../dist/index.js";

const WORDS = [
  ["kitap", "Ciltli veya ciltsiz"],
  ["bilgisayar", "elektronik"],
  ["merdiven", "basamak"],
  ["xyzxyzxyzxyz", null], // olmayan kelime
];

let passed = 0;
let failed = 0;

for (const [word, expect] of WORDS) {
  const result = await tdkService.lookup(word);

  if (expect === null) {
    if (result === null) {
      console.log(`  ✅ "${word}" → null (beklenen)`);
      passed++;
    } else {
      console.log(`  ❌ "${word}" → beklenen: null, alınan: ${result.word}`);
      failed++;
    }
  } else if (result && result.meaning?.toLowerCase().includes(expect.toLowerCase())) {
    console.log(`  ✅ "${word}" → ${result.meaning.slice(0, 60)}...`);
    passed++;
  } else {
    console.log(`  ❌ "${word}" → beklenen: "${expect}", alınan: ${result?.meaning ?? null}`);
    failed++;
  }

  // Detaylı çıktı
  if (result) {
    console.log(`     köken: ${result.language ?? "?"}`);
    console.log(`     anlamlar: ${result.meanings.length}`);
    if (result.compoundWords.length) console.log(`     birleşik: ${result.compoundWords.slice(0, 3).join(", ")}${result.compoundWords.length > 3 ? "..." : ""}`);
    if (result.proverbs.length) console.log(`     atasözü: ${result.proverbs.slice(0, 2).join(", ")}${result.proverbs.length > 2 ? "..." : ""}`);
  }
  console.log("");
}

console.log(`\n📊 ${passed} geçti, ${failed} kaldı`);
process.exit(failed > 0 ? 1 : 0);
