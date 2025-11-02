// utils/warrantyClient.ts
export type WarrantyRecord = {
  serials: string[];
  brand: string;
  model: string;
  purchaseDate: string; // ISO (YYYY-MM-DD)
  expireDate: string; // ISO
  warranty: { value: number; unit: "month" | "day" };
  companyService: string;
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
  const key = normSerial(serial);

  // Try backend API first
  try {
    type RemoteItem = {
      warrantySerial: string;
      productName: string;
      productSerial: string;
      duration: number;
      startDate: string; // ISO
      endDate: string; // ISO
      trackingSerial?: string;
      warrantySerialName?: string; // e.g. center name
      companyService?: string;
      warrantyName?: string; // e.g. brand/provider name
    };

    // Resolve base URL from runtime config if provided, else localhost:3100
    const { public: pub } =
      typeof useRuntimeConfig === "function"
        ? useRuntimeConfig()
        : ({ public: {} } as any);
    const base: string =
      (pub as any).warrantyApiBase || "http://192.168.1.159:3100";

    const remote = await $fetch<RemoteItem[]>(
      `${base.replace(/\/$/, "")}/api/v1/warranty/inquiry/${encodeURIComponent(
        key
      )}`
    );

    if (Array.isArray(remote) && remote.length > 0) {
      const r = remote[0];
      const serials = [r.productSerial, r.warrantySerial, r.trackingSerial]
        .filter((x): x is string => Boolean(x))
        .map(normSerial);

      const mapped: WarrantyRecord = {
        serials,
        brand: "",
        model: r.productName || "",
        purchaseDate: r.startDate,
        expireDate: r.endDate,
        warranty: { value: r.duration ?? 0, unit: "month" },
        companyService: r.warrantySerialName || "",
        serviceCenter: r.warrantyName || "",
        status: {
          current: "registered",
          history: [
            r.startDate
              ? { key: "registered", at: r.startDate, note: "شروع گارانتی" }
              : undefined,
          ].filter(Boolean) as { key: string; at: string; note?: string }[],
        },
        policyRef: undefined,
      };

      return mapped;
    }
  } catch {
    // ignore and fall back to local mock DB
  }

  // Fallback: search local mock DB
  const db = await loadDB();
  return (
    db.records.find((r) => r.serials.some((s) => normSerial(s) === key)) || null
  );
}
