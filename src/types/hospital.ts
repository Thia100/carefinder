export type Hospital = {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  lga: string | null;
  phone: string | null;
  email: string | null;
  specialty: string | null;
  ownership_type: string | null;
  description: string | null;
  rating: number | null;
  visiting_hours: string | null;
  image_url: string | null;
};