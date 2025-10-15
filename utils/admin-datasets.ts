export type AdminDataset = {
  key: string;
  title: string;
  file: string; // path under public as served path
  type: "array" | "object";
  columns?: string[]; // suggested columns when array
  description?: string;
};

export const adminDatasets: AdminDataset[] = [
  {
    key: "products",
    title: "محصولات",
    file: "/data/products.json",
    type: "array",
    columns: ["title", "brandSlug", "parentCategory", "childCategory", "priceToman"],
  },
  {
    key: "categories",
    title: "دسته‌بندی‌ها",
    file: "/data/categories.json",
    type: "object",
  },
  {
    key: "hero-slides",
    title: "اسلایدهای هدر",
    file: "/data/hero-slides.json",
    type: "array",
    columns: ["image", "title", "ctaLabel", "ctaLink"],
    description: "اسلایدر صفحه اصلی (تصاویر و متن اختیاری)",
  },
  {
    key: "service-centers",
    title: "نمایندگی‌ها",
    file: "/data/service-centers.json",
    type: "array",
    columns: ["slug", "title", "city", "primary"],
  },
  {
    key: "home-features",
    title: "ویژگی‌های صفحه اصلی",
    file: "/data/home-features.json",
    type: "array",
    columns: ["title", "desc", "icon"],
  },
  {
    key: "service-stats",
    title: "آمار سرویس",
    file: "/data/service-stats.json",
    type: "array",
    columns: ["id", "label", "value", "suffix"],
  },
  {
    key: "home-timeline",
    title: "مراحل ارسال",
    file: "/data/home-timeline.json",
    type: "array",
    columns: ["title", "desc"],
  },
  {
    key: "faq",
    title: "سؤالات متداول",
    file: "/data/faq.json",
    type: "array",
    columns: ["q", "a"],
  },
  {
    key: "downloads",
    title: "دانلودها",
    file: "/data/downloads.json",
    type: "array",
    columns: ["id", "title", "file", "updated"],
  },
  {
    key: "brands",
    title: "برندها",
    file: "/data/brands.json",
    type: "array",
    columns: ["name", "logo"],
  },
  {
    key: "quick-contacts",
    title: "ارتباط سریع",
    file: "/data/quick-contacts.json",
    type: "object",
  },
  {
    key: "blogs",
    title: "مقالات",
    file: "/data/blogs.json",
    type: "array",
    columns: ["slug", "title", "date", "readMinutes", "hot"],
  },
  {
    key: "policies",
    title: "سیاست‌های گارانتی",
    file: "/data/policies.json",
    type: "array",
    columns: ["brand", "category", "product", "duration"],
  },
  {
    key: "warranty-mock",
    title: "بانک نمونه گارانتی",
    file: "/data/warranty-mock.json",
    type: "object",
  },
  {
    key: "rbac-roles",
    title: "دسترسی RBAC",
    file: "/data/rbac-roles.json",
    type: "object",
  },
  {
    key: "abac-rules",
    title: "قوانین ABAC",
    file: "/data/abac-rules.json",
    type: "object",
  },
];

export const findDataset = (key: string) =>
  adminDatasets.find((d) => d.key === key);
