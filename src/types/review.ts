export type Review = {
  id: string;
  hospital_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  created_at: string;
};