import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import type { Paycheck } from "@/store/paychecks";

const CSV_MIME = "text/csv";
const CSV_UTI = "public.comma-separated-values-text";

type CsvValue = string | number | null | undefined;

const escapeCell = (value: CsvValue): string => {
  if (value === null || value === undefined) return "";

  const text = String(value);

  // Quote cells that contain separators, quotes, or line breaks.
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
};

const toCsv = (headers: string[], rows: CsvValue[][]): string =>
  [headers, ...rows]
    .map((row) => row.map(escapeCell).join(","))
    .join("\r\n");

const formatAmount = (value: number | null | undefined): string =>
  typeof value === "number" && Number.isFinite(value) ? value.toFixed(2) : "";

const timeValue = (value: string | null | undefined): number => {
  if (!value) return 0;

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const sortByDateDesc = <T extends { date: string | null }>(items: T[]): T[] =>
  [...items].sort((a, b) => timeValue(b.date) - timeValue(a.date));

const summarizeItems = (items: ReceiptItem[] | undefined): string =>
  (items ?? [])
    .map((item) => {
      const quantity =
        typeof item.quantity === "number" && Number.isFinite(item.quantity)
          ? item.quantity
          : 1;
      const label =
        quantity === 1 ? item.name : `${item.name} x${quantity}`;
      const price =
        typeof item.total_price === "number" &&
        Number.isFinite(item.total_price)
          ? ` (${item.total_price.toFixed(2)})`
          : "";

      return `${label}${price}`;
    })
    .join("; ");

export const buildReceiptsCsv = (receipts: Receipt[]): string => {
  const headers = [
    "Receipt ID",
    "Merchant",
    "Address",
    "Date",
    "Time",
    "Category",
    "Payment Method",
    "Currency",
    "Item Count",
    "Subtotal",
    "Tax",
    "Tip",
    "Discounts",
    "Total",
    "Items",
  ];

  const rows = sortByDateDesc(receipts).map((receipt) => [
    receipt.id,
    receipt.merchant?.name,
    receipt.merchant?.address,
    receipt.date,
    receipt.time,
    receipt.category,
    receipt.payment_method,
    receipt.currency,
    receipt.items?.length ?? 0,
    formatAmount(receipt.subtotal),
    formatAmount(receipt.tax),
    formatAmount(receipt.tip),
    formatAmount(receipt.discounts),
    formatAmount(receipt.total),
    summarizeItems(receipt.items),
  ]);

  return toCsv(headers, rows);
};

export const buildPaychecksCsv = (paychecks: Paycheck[]): string => {
  const headers = ["Paycheck ID", "Date", "Amount", "Category"];

  const rows = sortByDateDesc(paychecks).map((paycheck) => [
    paycheck.id,
    paycheck.date,
    formatAmount(paycheck.amount),
    paycheck.category,
  ]);

  return toCsv(headers, rows);
};

const today = (): string => new Date().toISOString().slice(0, 10);

const shareCsv = async (
  filename: string,
  csv: string,
  dialogTitle: string,
): Promise<void> => {
  const available = await Sharing.isAvailableAsync();

  if (!available) {
    throw new Error("Sharing isn't available on this device.");
  }

  const file = new File(Paths.cache, filename);
  file.create({ overwrite: true });
  // Prefix with a UTF-8 BOM so Excel opens accented characters correctly.
  await file.write(`\uFEFF${csv}`);

  await Sharing.shareAsync(file.uri, {
    mimeType: CSV_MIME,
    UTI: CSV_UTI,
    dialogTitle,
  });
};

export const shareReceiptsCsv = (receipts: Receipt[]): Promise<void> =>
  shareCsv(
    `benny-receipts-${today()}.csv`,
    buildReceiptsCsv(receipts),
    "Export receipts",
  );

export const sharePaychecksCsv = (paychecks: Paycheck[]): Promise<void> =>
  shareCsv(
    `benny-paychecks-${today()}.csv`,
    buildPaychecksCsv(paychecks),
    "Export paychecks",
  );
