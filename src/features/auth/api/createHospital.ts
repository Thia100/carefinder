import { supabase } from "../../../lib/supabase";

type CreateHospitalInput = {
  name: string;
  address: string;
  city: string;
  lga: string;
  phone: string;
  email: string;
  specialty: string;
  ownership_type: string;
  description: string;
};

export async function createHospital(
  hospital: CreateHospitalInput,
) {
  const { error } = await supabase
    .from("hospitals")
    .insert(hospital);

  if (error) {
    throw error;
  }
}