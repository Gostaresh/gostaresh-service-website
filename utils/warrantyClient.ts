// utils/warrantyClient.ts
export type WarrantyRecord = {
  serials: string[];
  brand: string;
  model: string;
  purchaseDate: string; // ISO (YYYY-MM-DD)
  expireDate: string; // ISO
  warranty: { value: number; unit: "month" | "day" };
  serviceCenter: string;
  status: {
    current: string;
    history: { key: string; at: string; note?: string }[];
  };
  policyRef?: { brand: string; category: string };
};

export type WarrantyDB = {
  meta: { version: number; updatedAt: string };
  records: WarrantyRecord[];
};

const toEn = (s: string) =>
  s.replace(/[۰-۹]/g, (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);
const normSerial = (v: string) =>
  toEn(v)
    .replace(/[^A-Za-z0-9-]/g, "")
    .toUpperCase();

let _cache: WarrantyDB | null = null;

export async function loadDB(): Promise<WarrantyDB> {
  if (_cache) return _cache;
  try {
    _cache = await $fetch<WarrantyDB>("/mock/warranty-mock.json");
  } catch {
    // fallback (اختیاری) اگر فایل را در مسیر data/ گذاشتی
    const local = await import("@/public/data/warranty-mock.json");
    _cache = local.default as WarrantyDB;
  }
  return _cache;
}

export async function findWarrantyBySerial(
  serial: string
): Promise<WarrantyRecord | null> {
  const db = await loadDB();
  const key = normSerial(serial);
  return (
    db.records.find((r) => r.serials.some((s) => normSerial(s) === key)) || null
  );
}
