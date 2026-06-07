import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHospital } from "../features/auth/api/getHospital";
import { editHospital } from "../features/auth/api/editHospital";
import type { Hospital } from "../types/hospital";
import { Spinner } from "../components/ui/spinner";
import { useForm } from "@tanstack/react-form";
import { Input } from "../components/ui/Input";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "../components/ui/Button";

const hospitalSchema = z.object({
  name: z.string().min(1, "Hospital name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  lga: z.string().min(1, "LGA is required"),
  phone: z
    .string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, "Please input correct number format"),
  email: z.string().email("Invalid email"),
  specialty: z.string().min(1, "Specialty is required"),
  ownership_type: z.string().min(1, "Ownership type is required"),
  description: z.string().min(12, "Enter description"),

  latitude: z
    .number()
    .min(-90, "Latitude must be at least -90")
    .max(90, "Latitude must be at most 90"),

  longitude: z
    .number()
    .min(-180, "Longitude must be at least -180")
    .max(180, "Longitude must be at most 180"),

  visiting_hours: z.string(),
  notes: z.string(),
});

const getErrorMessage = (error: unknown): string => {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Invalid value";
};

export function EditHospital() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm({
    defaultValues: {
      name: "",
      address: "",
      city: "",
      lga: "",
      phone: "",
      email: "",
      specialty: "",
      ownership_type: "",
      description: "",
      visiting_hours: "",
      notes: "",
      latitude: 0,
      longitude: 0,
    },

    validators: {
      onSubmit: hospitalSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        if (!hospital) return;

        await editHospital({
          id: hospital.id,
          ...value,
        });

        toast.success("Hospital updated");
        navigate("/", { state: { refreshed: true } });
      } catch (error) {
        toast.error("Failed to update");
      }
    },
  });

  useEffect(() => {
    async function loadHospital() {
      if (!id) return;
      try {
        const data = await getHospital(id);
        setHospital(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadHospital();
  }, [id]);

  useEffect(() => {
    if (!hospital) return;

    form.reset({
      name: hospital.name ?? "",
      address: hospital.address ?? "",
      city: hospital.city ?? "",
      lga: hospital.lga ?? "",
      phone: hospital.phone ?? "",
      email: hospital.email ?? "",
      specialty: hospital.specialty ?? "",
      ownership_type: hospital.ownership_type ?? "",
      description: hospital.description ?? "",
      visiting_hours: hospital.visiting_hours ?? "",
      notes: hospital.notes ?? "",
      latitude: hospital.latitude ?? 0,
      longitude: hospital.longitude ?? 0,
    });
  }, [hospital, form]);

  if (loading) return <Spinner />;
  if (!hospital) return <p>Hospital not found</p>;

  const { Field, Subscribe } = form;

  return (
    <main>
      <h1>Edit Hospital</h1>
      <p>Hospital ID: {id}</p>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Field name="name" validators={{ onBlur: hospitalSchema.shape.name }}>
          {({ state, handleChange }) => (
            <>
              <Input
                label="Name"
                value={state.value ?? ""}
                onChange={(e) => handleChange(e.target.value)}
              />
              {state.meta.errors.length > 0 && (
                <p className="text-red-600">
                  {getErrorMessage(state.meta.errors[0])}
                </p>
              )}
            </>
          )}
        </Field>

        <Field name="address" validators={{ onBlur: hospitalSchema.shape.address }}>
          {({ state, handleChange }) => (
            <>
              <Input
                label="Address"
                value={state.value ?? ""}
                onChange={(e) => handleChange(e.target.value)}
              />
              {state.meta.errors.length > 0 && (
                <p className="text-red-600">
                  {getErrorMessage(state.meta.errors[0])}
                </p>
              )}
            </>
          )}
        </Field>

        <Field name="city" validators={{ onBlur: hospitalSchema.shape.city }}>
          {({ state, handleChange }) => (
            <>
              <Input
                label="City"
                value={state.value ?? ""}
                onChange={(e) => handleChange(e.target.value)}
              />
              {state.meta.errors.length > 0 && (
                <p className="text-red-600">
                  {getErrorMessage(state.meta.errors[0])}
                </p>
              )}
            </>
          )}
        </Field>

        <Field name="lga" validators={{ onBlur: hospitalSchema.shape.lga }}>
          {({ state, handleChange }) => (
            <>
              <Input
                label="LGA"
                value={state.value ?? ""}
                onChange={(e) => handleChange(e.target.value)}
              />
              {state.meta.errors.length > 0 && (
                <p className="text-red-600">
                  {getErrorMessage(state.meta.errors[0])}
                </p>
              )}
            </>
          )}
        </Field>

        <Field name="phone" validators={{ onBlur: hospitalSchema.shape.phone }}>
          {({ state, handleChange }) => (
            <>
              <Input
                label="Phone"
                value={state.value ?? ""}
                onChange={(e) => handleChange(e.target.value)}
              />
              {state.meta.errors.length > 0 && (
                <p className="text-red-600">
                  {getErrorMessage(state.meta.errors[0])}
                </p>
              )}
            </>
          )}
        </Field>

        <Field name="email" validators={{ onBlur: hospitalSchema.shape.email }}>
          {({ state, handleChange }) => (
            <>
              <Input
                label="Email"
                value={state.value ?? ""}
                onChange={(e) => handleChange(e.target.value)}
              />
              {state.meta.errors.length > 0 && (
                <p className="text-red-600">
                  {getErrorMessage(state.meta.errors[0])}
                </p>
              )}
            </>
          )}
        </Field>

        <Field name="specialty" validators={{ onBlur: hospitalSchema.shape.specialty }}>
          {({ state, handleChange }) => (
            <div>
              <label>Specialty</label>

              <select
                name="specialty"
                value={state.value ?? ""}
                onChange={(e) => handleChange(e.target.value)}
              >
                <option value="">Select Specialty</option>
                <option value="Maternity">Maternity</option>
                <option value="Emergency">Emergency</option>
                <option value="Dental">Dental</option>
                <option value="Pediatric">Pediatric</option>
              </select>

              {state.meta.errors.length > 0 && (
                <p className="text-red-600">
                  {getErrorMessage(state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        </Field>

        <Field name="latitude" validators={{ onBlur: hospitalSchema.shape.latitude }}>
          {({ state, handleChange }) => (
            <Input
              label="Latitude"
              type="number"
              value={state.value ?? ""}
              onChange={(e) => handleChange(Number(e.target.value))}
            />
          )}
        </Field>

        <Field name="longitude" validators={{ onBlur: hospitalSchema.shape.longitude }}>
          {({ state, handleChange }) => (
            <Input
              label="Longitude"
              type="number"
              value={state.value ?? ""}
              onChange={(e) => handleChange(Number(e.target.value))}
            />
          )}
        </Field>

        <Subscribe selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}>
          {({ canSubmit, isSubmitting }) => (
            <Button
              type="submit"
              disabled={!canSubmit}
              text={isSubmitting ? "Updating..." : "Update Hospital"}
            />
          )}
        </Subscribe>
      </form>
    </main>
  );
}