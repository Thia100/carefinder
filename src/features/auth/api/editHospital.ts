import { supabase } from "../../../lib/supabase";

type EditHospitalInput = {
  id: string;
  name: string;
  address: string;
  city: string;
  lga: string;
  phone: string;
  email: string;
  specialty: string;
  ownership_type: string;
  description: string;
  visiting_hours: string;
  notes: string;
  latitude: number;
  longitude: number;
  image_url?: string;
};

export async function editHospital(data: EditHospitalInput) {
  const { id, ...hospitalData } = data;

  const { error } = await supabase
    .from("hospitals")
    .update(hospitalData)
    .eq("id", id);

  if (error) {
    throw error;
  }
}