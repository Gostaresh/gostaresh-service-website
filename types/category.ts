export type ParentCategory = {
  slug: string;
  title: string;
  image?: string;
  summary?: string;
  tags?: string[];
};

export type ChildCategory = {
  parentSlug: string;
  slug: string;
  title: string;
  image?: string;
  summary?: string;
  tags?: string[];
};

export type CategoriesData = {
  parents: ParentCategory[];
  children: ChildCategory[];
};

