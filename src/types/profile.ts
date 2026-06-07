export type Profile = {
  id: string;
  full_name: string | null;
  role: "user" | "admin";
};