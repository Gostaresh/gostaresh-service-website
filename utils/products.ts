import type { Product } from "@/types/product";

let _products: Product[] | null = null;

export async function loadProducts(): Promise<Product[]> {
  if (_products) return _products;
  const data = (await import("@/public/data/products.json"))
    .default as Product[];
  _products = data;
  return data;
}

export async function getProducts(): Promise<Product[]> {
  const list = await loadProducts();
  return list.filter((p) => p.status !== "inactive");
}

export async function findProduct(slug: string): Promise<Product | undefined> {
  const list = await loadProducts();
  return list.find((p) => p.slug === slug);
}

export async function getProductsByBrand(brandSlug: string): Promise<Product[]> {
  const list = await getProducts();
  return list.filter((p) => p.brandSlug === brandSlug);
}

export async function getProductsByCategory(
  parentSlug: string,
  childSlug?: string
): Promise<Product[]> {
  const list = await getProducts();
  return list.filter(
    (p) =>
      p.parentCategory === parentSlug && (!childSlug || p.childCategory === childSlug)
  );
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const list = await getProducts();
  const featured = list.filter((p) => p.featured);
  const rest = list.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, limit);
}

export function formatToman(amount: number): string {
  try {
    const parts = amount.toLocaleString("fa-IR");
    return `${parts} تومان`;
  } catch {
    return `${amount} تومان`;
  }
}

