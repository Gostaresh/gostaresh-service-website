export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  date: string;
  readMinutes: number;
  tags: string[];
  hot?: boolean;
  content: string[];
}
