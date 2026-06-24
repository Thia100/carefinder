import { supabase } from "../lib/supabase";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { toast } from "sonner";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "../components/ui/spinner";

import { BackHome } from "../components/ui/BackHome";

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
      <div className="text-left p-4 ">
        <BackHome />
      </div>

      <div className="max-w-96 mx-auto text-center">
        <div className="text-center">
          <p className="text-3xl mb-1.5 font-semibold text-[#3B8780]">
            Login to CareFinder
          </p>
          <p className="text-sm text-[#5580AC]">
            Login to access more features
          </p>
        </div>

        <form
          className="border rounded-3xl border-gray-400 bg-white mt-18 px-4 py-5 shadow-lg"
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
                  className="px-3 py-2 border rounded-2xl text-xs mt-1.5 outline-none focus:border-[#5580AC]"
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
              <div className="flex flex-col text-start mt-8">
                <label htmlFor="password" className="text-sm">
                  Password
                </label>
                <div className="flex px-3 py-1.5 border rounded-2xl text-sm mt-1.5 focus-within:border-[#5580AC]">
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
                    className="focus:outline-none w-full text-xs"
                  />
                  <button
                    className="self-center ml-1 cursor-pointer"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        className="text-xs hover:text-blue-500"
                      />
                    ) : (
                      <FontAwesomeIcon icon={faEye} className="text-xs" />
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
                className="cursor-pointer mt-12 py-1 inline-flex w-full justify-center border border-white bg-green-800 text-white rounded-2xl hover:bg-green-700 transition-colors ease-in-out duration-500"
              >
                {isSubmitting ? <Spinner /> : "Login"}
              </button>
            )}
          </Subscribe>
        </form>

        <Link
          to={"/admin"}
          className="text-sm hover:text-blue-400 transition delay-200 block mt-5"
        >
          Login as Admin
        </Link>
        <Link
          to={"/signup"}
          className="mt-2 text-sm hover:text-blue-400 transition delay-200 block"
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
}
