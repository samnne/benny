declare module "*.png" {
  const src: string;
  export default src;
}

type ReceiptCategory =
  | "groceries"
  | "dining"
  | "transport"
  | "entertainment"
  | "health"
  | "shopping"
  | "utilities"
  | "other";

type Confidence = "high" | "medium" | "low";

interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Merchant {
  name: string;
  address: string | null;
}

interface Receipt {
  merchant: Merchant;
  id: string;
  date: string | null;
  time: string | null;
  currency: string;
  items: ReceiptItem[];
  subtotal: number | null;
  tax: number | null;
  tip: number | null;
  discounts: number | null;
  total: number;
  payment_method: string | null;
  category: ReceiptCategory;
  confidence: Confidence;
  benny_message: string;
}
