export interface Memory {
  id: string;
  name: string;
  message: string;
  color_id: string;
  created_at: string;
  slug: string;
}

export interface Submission {
  id: string;
  name: string;
  message: string;
  color_id: string;
  status: 'pending' | 'approved' | 'rejected';
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
