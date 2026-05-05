export interface Memory {
  id: string;
  name: string;
  message: string;
  color_id: string;
  created_at: string;
  slug: string;
  pinned_until?: string | null;
}

export interface Submission {
  id: string;
  name: string;
  message: string;
  color_id: string;
  status: 'pending' | 'approved';
  ip_hash: string;
  country: string;
  user_uuid: string;
  created_at: string;
}

export interface JournalPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  total_memories: number;
  total_pending: number;
  total_rejected: number;
  total_banned: number;
}

export interface NameStat {
  name: string;
  slug: string;
  count: number;
}
