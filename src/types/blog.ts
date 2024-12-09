export interface BlogPost {
  id: string;
  title: string;
  content: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  featured_image_url?: string | null;
}