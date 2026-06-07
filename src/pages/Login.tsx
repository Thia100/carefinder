import { supabase } from "../lib/supabase";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { toast } from "sonner";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "../components/ui/spinner";


const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const getErrorMessage = (error: unknown): string => {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Invalid value";
};

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: value.email,
        password: value.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      navigate("/");

      toast.success("Logged in successfully");
    },
  });

  const { Field, Subscribe } = form;

  return (
    <main className="bg-white">
      <div className="h-screen flex flex-col text-center justify-center w-full mx-auto max-w-lg px-4">
        <p className="text-2xl">Login to CareFinder</p>
        <p className="text-sm text-gray-500">Login to access more features</p>

        <form
          className="border rounded-3xl border-gray-400 bg-white mt-4 p-3 shadow-lg"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <Field name="email" validators={{ onBlur: loginSchema.shape.email }}>
            {({ state, handleChange, handleBlur }) => (
              <div className="flex flex-col text-start">
                <label htmlFor="email" className="text-sm">
                  Email Address
                </label>
                <input
                className="px-3 py-1.5 border rounded-2xl text-sm mt-1.5"
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
            validators={{ onBlur: loginSchema.shape.password }}
          >
            {({ state, handleBlur, handleChange }) => (
              <div className="flex flex-col text-start mt-6">
                <label htmlFor="password" className="text-sm">
                  Password
                </label>
                <div className="flex px-3 py-1.5 border rounded-2xl text-sm mt-1.5">
                  <input
                    id="password"
                    name="password"
                    placeholder="Robe@123"
                    autoComplete="password"
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
                {isSubmitting ? <Spinner /> : "Login"}
              </button>
            )}
          </Subscribe>
        </form>
        <p className="text-sm mt-5">Login as <Link to={"/admin"} className=" hover:text-green-400 cursor-pointer trasition delay-200">admin</Link></p>
         <p className="text-sm mt-5">Go back <Link to={"/"} className=" hover:text-green-400 cursor-pointer trasition delay-200">home ➡️</Link></p>
      </div>
    </main>
  );
}
