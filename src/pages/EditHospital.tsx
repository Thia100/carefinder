import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHospital } from "../features/auth/api/getHospital";
import { editHospital } from "../features/auth/api/editHospital";
import { deleteHospital } from "../features/auth/api/deleteHospital";
import type { Hospital } from "../types/hospital";
import { Spinner } from "../components/ui/spinner";
import { useForm } from "@tanstack/react-form";
import { Input } from "../components/ui/Input";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "../components/ui/Button";
import { BackHome } from "../components/ui/BackHome";
import MDEditor from "@uiw/react-md-editor";

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
  description: z.string().min(10, "Enter description"),

  latitude: z
    .number()
    .min(-90, "Latitude must be at least -90")
    .max(90, "Latitude must be at most 90"),

  longitude: z
    .number()
    .min(-180, "Longitude must be at least -180")
    .max(180, "Longitude must be at most 180"),

  visiting_hours: z.string().min(1, "Visiting hours are required"),
  notes: z.string().min(1, "Notes are required"),
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
        console.error(error);
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

  async function handleDelete() {
    if (!hospital) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hospital? This action cannot be undone.",
    );
    if (!confirmDelete) return;
    try {
      await deleteHospital(hospital.id);
      toast.success("Hospital deleted successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete hospital");
    }
  }
  return (
    <main className="min-h-screen bg-[#FAFAFD] py-10 px-4">
      <div className="py-2">
        <BackHome />
      </div>
      <section className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#122056]">Edit Hospital</h1>

          <p className="mt-2 text-slate-500">
            Update hospital information and services.
          </p>
        </div>

        <form
          className="bg-white rounded-3xl border border-[#EEEFFD] shadow-sm p-8 space-y-8"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-[#122056]">
              Basic Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Field
                  name="name"
                  validators={{ onBlur: hospitalSchema.shape.name }}
                >
                  {({ state, handleChange, handleBlur }) => (
                    <>
                      <Input
                        label="Name"
                        value={state.value ?? ""}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                      />
                      {state.meta.errors.length > 0 && (
                        <p className="text-red-600">
                          {getErrorMessage(state.meta.errors[0])}
                        </p>
                      )}
                    </>
                  )}
                </Field>

                <Field
                  name="address"
                  validators={{ onBlur: hospitalSchema.shape.address }}
                >
                  {({ state, handleChange, handleBlur }) => (
                    <>
                      <Input
                        label="Address"
                        value={state.value ?? ""}
                        onBlur={handleBlur}
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
              </div>
              <div>
                <Field
                  name="city"
                  validators={{ onBlur: hospitalSchema.shape.city }}
                >
                  {({ state, handleChange, handleBlur }) => (
                    <>
                      <Input
                        label="City"
                        value={state.value ?? ""}
                        onBlur={handleBlur}
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

                <Field
                  name="lga"
                  validators={{ onBlur: hospitalSchema.shape.lga }}
                >
                  {({ state, handleChange, handleBlur }) => (
                    <>
                      <Input
                        label="LGA"
                        value={state.value ?? ""}
                        onBlur={handleBlur}
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
              </div>
            </div>
          </div>

          <div className="space-y-5 pt-6 border-t border-[#EEEFFD]">
            <h2 className="text-xl font-semibold text-[#122056]">
              Contact Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <Field
                name="phone"
                validators={{ onBlur: hospitalSchema.shape.phone }}
              >
                {({ state, handleChange, handleBlur }) => (
                  <>
                    <Input
                      label="Phone"
                      value={state.value ?? ""}
                      onBlur={handleBlur}
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

              <Field
                name="email"
                validators={{ onBlur: hospitalSchema.shape.email }}
              >
                {({ state, handleChange, handleBlur }) => (
                  <>
                    <Input
                      label="Email"
                      value={state.value ?? ""}
                      onBlur={handleBlur}
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
            </div>

            <Field
              name="specialty"
              validators={{ onBlur: hospitalSchema.shape.specialty }}
            >
              {({ state, handleChange, handleBlur }) => (
                <div>
                  <label>Specialty</label>

                  <select
                    name="specialty"
                    value={state.value ?? ""}
                    onBlur={handleBlur}
                    onChange={(e) => handleChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#5B65DC] focus:ring-2 focus:ring-[#EEEFFD]"
                  >
                    <option value="">Select Specialty</option>
                    <option value="Maternity">Maternity</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Dental">Dental</option>
                    <option value="Pediatric">Pediatric</option>
                  </select>

                  {state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      {getErrorMessage(state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </Field>
          </div>

          <div className="space-y-5 pt-6 border-t border-[#EEEFFD]">
            <h2 className="text-xl font-semibold text-[#122056]">Location</h2>

            <div className="grid md:grid-cols-2 gap-5">
              <Field
                name="latitude"
                validators={{ onBlur: hospitalSchema.shape.latitude }}
              >
                {({ state, handleChange, handleBlur }) => (
                  <Input
                    label="Latitude"
                    type="number"
                    value={state.value ?? ""}
                    onBlur={handleBlur}
                    onChange={(e) => handleChange(Number(e.target.value))}
                  />
                )}
              </Field>

              <Field
                name="longitude"
                validators={{ onBlur: hospitalSchema.shape.longitude }}
              >
                {({ state, handleChange, handleBlur }) => (
                  <Input
                    label="Longitude"
                    type="number"
                    value={state.value ?? ""}
                    onBlur={handleBlur}
                    onChange={(e) => handleChange(Number(e.target.value))}
                  />
                )}
              </Field>
            </div>
          </div>

          <div className="pt-6 border-t border-[#EEEFFD]">
            <Field
              name="description"
              validators={{
                onBlur: hospitalSchema.shape.description,
              }}
            >
              {({ state, handleChange, handleBlur }) => (
                <div className="space-y-2">
                  <label className="font-medium text-[#122056]">
                    Hospital Description
                  </label>

                  <div data-color-mode="light">
                    <MDEditor
                      value={state.value}
                      onBlur={handleBlur}
                      onChange={(value) => handleChange(value || "")}
                      preview="live"
                      height={200}
                    />
                  </div>

                  {state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500">
                      {getErrorMessage(state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </Field>
          </div>

          <div className="pt-6 border-t border-[#EEEFFD]">
            <Field
              name="notes"
              validators={{
                onBlur: hospitalSchema.shape.notes,
              }}
            >
              {({ state, handleChange, handleBlur }) => (
                <div className="space-y-2">
                  <label className="font-medium text-[#122056]">
                    Hospital Notes
                  </label>

                  <div data-color-mode="light">
                    <MDEditor
                      value={state.value}
                      onBlur={handleBlur}
                      onChange={(value) => handleChange(value || "")}
                      preview="live"
                      height={200}
                    />
                  </div>

                  {state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500">
                      {getErrorMessage(state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </Field>
          </div>

          <div className="pt-6 border-t border-[#EEEFFD]">
            <Field
              name="visiting_hours"
              validators={{
                onBlur: hospitalSchema.shape.visiting_hours,
              }}
            >
              {({ state, handleChange, handleBlur }) => (
                <div className="space-y-2">
                  <label className="font-medium text-[#122056]">
                    Visiting Hours
                  </label>

                  <div data-color-mode="light">
                    <MDEditor
                      value={state.value}
                      onBlur={handleBlur}
                      onChange={(value) => handleChange(value || "")}
                      preview="live"
                      height={200}
                    />
                  </div>

                  {state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500">
                      {getErrorMessage(state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </Field>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-between pt-8 border-t border-[#EEEFFD]">
            <Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ canSubmit, isSubmitting }) => (
                <div className="w-full">
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    text={isSubmitting ? "Updating..." : "Update Hospital"}
                  />
                </div>
              )}
            </Subscribe>

            <div className="w-full">
              <Button
                type="button"
                onClick={handleDelete}
                text="Delete Hospital"
                variant="danger"
              />
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
