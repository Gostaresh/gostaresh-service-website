export type ProductFeature = { key: string; value: string };

export type Product = {
  id: string;
  slug: string;
  title: string;
  brandSlug: string;
  parentCategory: string;
  childCategory: string;
  priceToman: number; // amount in Toman
  gallery: string[]; // image URLs
  summary: string;
  description: string; // HTML or markdown as string
  features: ProductFeature[];
  tags: string[];
  featured?: boolean;
  status?: "active" | "inactive";
};

