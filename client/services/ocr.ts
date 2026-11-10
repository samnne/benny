import TextRecognition from "@react-native-ml-kit/text-recognition";

const RECEIPT_THRESHOLD = 0.5;

const PRICE_AT_END = /\d{1,5}[.,]\d{2}\s*[-A-Z]{0,2}$/;
const TOTAL = /\b(sub\s?total|total|amount due|balance due|grand total)\b/i;
const TAX = /\b(tax|gst|pst|hst|vat)\b/i;
const DATE =
  /\b(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}|\d{4}[\/\-.]\d{1,2}[\/\-.]\d{1,2}|(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.? \d{1,2},? \d{2,4})\b/i;
const PAYMENT =
  /\b(visa|mastercard|amex|debit|credit|cash|change|approved|card|tendered)\b/i;
const RECEIPT_WORDS =
  /\b(receipt|thank you|cashier|store|qty|item|invoice|order)\b/i;

export type ReceiptCheck = {
  isReceipt: boolean;
  confidence: number; // 0 to 1
  signals: Record<string, number>;
};

export function scoreReceiptText(lines: string[]): ReceiptCheck {
  const text = lines.join("\n");
  const priceLines = lines.filter((l) => PRICE_AT_END.test(l.trim())).length;

  const signals = {
    // Receipts have many lines that end in a price
    priceLines: (Math.min(priceLines, 6) / 6) * 0.35,
    total: TOTAL.test(text) ? 0.25 : 0,
    tax: TAX.test(text) ? 0.15 : 0,
    date: DATE.test(text) ? 0.1 : 0,
    payment: PAYMENT.test(text) ? 0.1 : 0,
    words: RECEIPT_WORDS.test(text) ? 0.05 : 0,
  };
  
  const confidence = Object.values(signals).reduce((a, b) => a + b, 0);
  console.log(confidence, signals)
  return { isReceipt: confidence >= RECEIPT_THRESHOLD, confidence, signals };
}

export async function isReceiptImage(imageUri: string): Promise<ReceiptCheck> {
  try {
    const result = await TextRecognition.recognize(imageUri);

    // Prefer per-line text so "item .... 4.99" stays together
    const lines = result.blocks.flatMap((b) => b.lines.map((l) => l.text));
    const fallback = result.text ? result.text.split("\n") : [];

    return scoreReceiptText(lines.length ? lines : fallback);
  } catch (error) {
    console.warn("OCR text recognition error, defaulting to valid:", error);
    return {
      isReceipt: true,
      confidence: 1.0,
      signals: {},
    };
  }
}
