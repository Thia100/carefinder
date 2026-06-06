import { supabase } from "../lib/supabase";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import {toast } from 'sonner';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAsterisk,
  faEyeSlash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";

const signupSchema = z.object({
  fullName: z.string().min(4, "user must be more than 4 letters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character",
    ),
});

const getErrorMessage = (error: unknown): string => {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Invalid value";
};

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signupSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await supabase.auth.signUp({
        email: value.email,
        password: value.password,
        options: {
          data: {
            full_name: value.fullName,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Signup sucessful")
      navigate("/")
    },
  });

  const { Field, Subscribe } = form;

  return (
    <main>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Field
          name="fullName"
          validators={{ onBlur: signupSchema.shape.fullName }}
        >
          {({ state, handleChange, handleBlur }) => (
            <div>
              <label htmlFor="fullName">
                Full Name <FontAwesomeIcon icon={faAsterisk} />
              </label>
              <input
                required
                id="fullName"
                type="text"
                placeholder="Fathia Gbolahan"
                autoComplete="name"
                name="fullName"
                value={state.value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                aria-invalid={!!state.meta.errors?.length}
              />
              {state.meta.errors.length > 0 && (
                <p className="text-xs text-red-600 mt-2">
                  {getErrorMessage(state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        </Field>

        <Field name="email" validators={{ onBlur: signupSchema.shape.email }}>
          {({ state, handleChange, handleBlur }) => (
            <div>
              <label htmlFor="email">
                Email Address <FontAwesomeIcon icon={faAsterisk} />
              </label>
              <input
                required
                id="email"
                type="email"
                placeholder="thegbolahanfathia@gmail.com"
                autoComplete="email"
                name="email"
                value={state.value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                aria-invalid={!!state.meta.errors?.length}
              />
              {state.meta.errors.length > 0 && (
                <p className="text-xs text-red-600 mt-2">
                  {getErrorMessage(state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        </Field>

        <Field
          name="password"
          validators={{ onBlur: signupSchema.shape.password }}
        >
          {({ state, handleBlur, handleChange }) => (
            <div className="mt-4">
              <label htmlFor="password" className="flex">
                Password <FontAwesomeIcon icon={faAsterisk} />
              </label>
              <div className="flex border rounded-lg border-gray-300 px-4 py-1">
                <input
                  required
                  id="password"
                  name="password"
                  placeholder="Robe@123"
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  value={state.value}
                  onBlur={handleBlur}
                  onChange={(e) => handleChange(e.target.value)}
                  aria-invalid={!!state.meta.errors?.length}
                  className="focus:outline-none w-full"
                />
                <button
                  className="self-center ml-1 cursor-pointer"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </button>
              </div>
              {state.meta.errors.length > 0 && (
                <p className="text-xs text-red-600 mt-2">
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
            <button
              type="submit"
              disabled={!canSubmit}
              className="cursor-pointer mt-10 py-1 inline-flex w-full justify-center border border-white bg-green-800 text-white rounded-2xl hover:bg-green-700 transition-colors ease-in-out duration-500"
            >
              {isSubmitting ? "Signing up..." : "Sign up"}
            </button>
          )}
        </Subscribe>
      </form>

      <div className="flex items-center gap-4 w-full max-w-sm my-6">
        <div className="flex-1 h-px bg-gray-300"></div>

        <span className="text-gray-500 text-sm whitespace-nowrap">
          or signup with
        </span>

        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <div className="flex justify-center gap-8">
        <Link to={""}>
          <FontAwesomeIcon icon={faFacebook} />
        </Link>
        <Link to={""}>
          <FontAwesomeIcon icon={faFacebook} />
        </Link>
        <Link to={""}>
          <FontAwesomeIcon icon={faFacebook} />
        </Link>
        <Link to={""}>
          <FontAwesomeIcon icon={faFacebook} />
        </Link>
      </div>
    </main>
  );
}
