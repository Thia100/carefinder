import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { supabase } from "../lib/supabase";
import MDEditor from "@uiw/react-md-editor";
import { BackButton } from "../components/ui/BackButton";

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
  file: z.string(),
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

export function CreateHospital() {
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);

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
      file: "",
      latitude: 0,
      longitude: 0,
      visiting_hours: "",
      notes: "",
    },
    validators: {
      onSubmit: hospitalSchema,
    },
    onSubmit: async ({ value }) => {
      let imageUrl = "";
      if (image) {
        const fileName = `${Date.now()}-${image.name}`;

        const { error: uploadError } = await supabase.storage
          .from("hospital-image")
          .upload(fileName, image);

        if (uploadError) {
          toast.error(uploadError.message);
          return;
        }

        const { data } = supabase.storage
          .from("hospital-image")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from("hospitals")
        .insert([{ ...value, image_url: imageUrl }]);

      if (error) {
        toast.error(error.message);
        return;
      }
      console.log(value);
      navigate("/");

      toast.success("Created Successfully");
    },
  });
  const { Field, Subscribe } = form;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto p-2">
        <BackButton />
        <section className="max-w-3xl mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Create Hospital</h1>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-8"
          >
            {/* Basic Information */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                name="name"
                validators={{ onBlur: hospitalSchema.shape.name }}
              >
                {({ state, handleBlur, handleChange }) => (
                  <div>
                    <Input
                      label="Name"
                      required
                      id="name"
                      type="text"
                      placeholder="Enter a name"
                      name="name"
                      value={state.value}
                      onChange={(e) => handleChange(e.target.value)}
                      onBlur={handleBlur}
                      aria-invalid={!!state.meta.errors?.length}
                    />
                    {state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-600">
                        {getErrorMessage(state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              </Field>

              <Field
                name="address"
                validators={{ onBlur: hospitalSchema.shape.address }}
              >
                {({ state, handleBlur, handleChange }) => (
                  <div>
                    <Input
                      label="Address"
                      required
                      type="text"
                      placeholder="123, Akindoyin street"
                      name="address"
                      value={state.value}
                      onBlur={handleBlur}
                      onChange={(e) => handleChange(e.target.value)}
                      aria-invalid={!!state.meta.errors?.length}
                    />
                    {state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-600">
                        {getErrorMessage(state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              </Field>

              <Field
                name="email"
                validators={{ onBlur: hospitalSchema.shape.email }}
              >
                {({ state, handleBlur, handleChange }) => (
                  <div>
                    <Input
                      label="Email Address"
                      required
                      type="email"
                      placeholder="thegbolahan@gmail.com"
                      name="email"
                      value={state.value}
                      onBlur={handleBlur}
                      onChange={(e) => handleChange(e.target.value)}
                      aria-invalid={!!state.meta.errors?.length}
                    />
                    {state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-600">
                        {getErrorMessage(state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              </Field>

              <Field
                name="phone"
                validators={{ onBlur: hospitalSchema.shape.phone }}
              >
                {({ state, handleBlur, handleChange }) => (
                  <div>
                    <Input
                      label="Phone Number"
                      required
                      type="tel"
                      placeholder="081567809"
                      name="phone"
                      value={state.value}
                      onBlur={handleBlur}
                      onChange={(e) => handleChange(e.target.value)}
                      aria-invalid={!!state.meta.errors?.length}
                    />
                    {state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-600">
                        {getErrorMessage(state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                name="lga"
                validators={{ onBlur: hospitalSchema.shape.lga }}
              >
                {({ state, handleBlur, handleChange }) => (
                  <div>
                    <Input
                      label="Local Government Area"
                      type="text"
                      placeholder="Boripe"
                      name="lga"
                      value={state.value}
                      onBlur={handleBlur}
                      onChange={(e) => handleChange(e.target.value)}
                      aria-invalid={!!state.meta.errors?.length}
                    />
                    {state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-600">
                        {getErrorMessage(state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              </Field>

              <Field
                name="city"
                validators={{ onBlur: hospitalSchema.shape.city }}
              >
                {({ state, handleBlur, handleChange }) => (
                  <div>
                    <Input
                      label="City"
                      required
                      type="text"
                      placeholder="Ile-Ife"
                      name="city"
                      value={state.value}
                      onBlur={handleBlur}
                      onChange={(e) => handleChange(e.target.value)}
                      aria-invalid={!!state.meta.errors?.length}
                    />
                    {state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-600">
                        {getErrorMessage(state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              </Field>

              <Field
                name="latitude"
                validators={{ onBlur: hospitalSchema.shape.latitude }}
              >
                {({ state, handleChange }) => (
                  <div>
                    <Input
                      label="Latitude"
                      type="number"
                      value={String(state.value)}
                      onChange={(e) => handleChange(Number(e.target.value))}
                    />
                  </div>
                )}
              </Field>

              <Field
                name="longitude"
                validators={{ onBlur: hospitalSchema.shape.longitude }}
              >
                {({ state, handleChange }) => (
                  <div>
                    <Input
                      label="Longitude"
                      type="number"
                      value={String(state.value)}
                      onChange={(e) => handleChange(Number(e.target.value))}
                    />
                  </div>
                )}
              </Field>
            </div>

            <div className="grid sm:grid-cols-2">
              <Field
                name="specialty"
                validators={{ onBlur: hospitalSchema.shape.specialty }}
              >
                {({ state, handleChange }) => (
                  <div>
                    <label htmlFor="specialty">Specialty</label>

                    <select
                      id="specialty"
                      value={state.value}
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

              <Field
                name="ownership_type"
                validators={{ onBlur: hospitalSchema.shape.ownership_type }}
              >
                {({ state, handleChange }) => (
                  <div>
                    <p>Ownership Type</p>

                    <div>
                      <label>
                        <input
                          type="radio"
                          name="ownership_type"
                          value="Public"
                          checked={state.value === "Public"}
                          onChange={(e) => handleChange(e.target.value)}
                        />
                        Public
                      </label>

                      <label>
                        <input
                          type="radio"
                          name="ownership_type"
                          value="Private"
                          checked={state.value === "Private"}
                          onChange={(e) => handleChange(e.target.value)}
                        />
                        Private
                      </label>
                    </div>

                    {state.meta.errors.length > 0 && (
                      <p className="text-red-600">
                        {getErrorMessage(state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              </Field>
            </div>

            <Field
              name="visiting_hours"
              validators={{ onBlur: hospitalSchema.shape.visiting_hours }}
            >
              {({ state, handleChange }) => (
                <div>
                  <label>Visiting Hours</label>
                  <div data-color-mode="light">
                    <MDEditor
                      value={state.value}
                      onChange={(value) => handleChange(value || "")}
                    />
                  </div>
                  {state.meta.errors.length > 0 && (
                    <p>{getErrorMessage(state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            </Field>

            <Field
              name="notes"
              validators={{ onBlur: hospitalSchema.shape.notes }}
            >
              {({ state, handleChange, handleBlur }) => (
                <div>
                  <label htmlFor="notes">Notes</label>
                  <div data-color-mode="light">
                    <MDEditor
                      value={state.value}
                      onChange={(value) => handleChange(value || "")}
                      onBlur={handleBlur}
                      id="notes"
                    ></MDEditor>
                  </div>
                  {state.meta.errors.length > 0 && (
                    <p>{getErrorMessage(state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            </Field>

            <Field
              name="description"
              validators={{ onBlur: hospitalSchema.shape.description }}
            >
              {({ state, handleChange, handleBlur }) => (
                <div>
                  <label htmlFor="description">Description</label>
                  <div data-color-mode="light">
                    <MDEditor
                      value={state.value}
                      onChange={(value) => handleChange(value || "")}
                      onBlur={handleBlur}
                      id="description"
                    ></MDEditor>
                  </div>
                  {state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {getErrorMessage(state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </Field>

            <Field name="file">
              {({ state, handleBlur }) => (
                <div>
                  <Input
                    label="Upload file"
                    type="file"
                    name="file"
                    accept="image/*"
                    value={state.value}
                    onBlur={handleBlur}
                    onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                    aria-invalid={!!state.meta.errors?.length}
                  />
                  {state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {getErrorMessage(state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </Field>

            <Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ canSubmit, isSubmitting }) => (
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  text={isSubmitting ? "Creating..." : "Create Hospital"}
                />
              )}
            </Subscribe>
          </form>
        </section>
      </div>
    </main>
  );
}
