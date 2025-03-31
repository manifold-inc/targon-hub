"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { reactClient } from "@/trpc/react";
import { useAuth } from "../_components/providers";

type Inputs = {
  email: string;
  password: string;
  password2: string;
};
const errorStyle = "text-xs text-red-500";

export default function Page() {
  const [visable, setVisable] = useState(false);
  const { refetch } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Inputs>();
  const createAccount = reactClient.account.createAccount.useMutation({
    onError: (e) => {
      toast.error(e.message);
    },
    onSuccess: () => {
      refetch();
      router.push("/");
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (createAccount.isLoading) return;
    createAccount.mutate(data);
  };
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-mf-ash-700">
            Sign Up
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-mf-milk-300 px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              action="#"
              method="POST"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-mf-ash-700"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Email Address"
                    className="block w-full rounded-md border-0 bg-mf-milk-300 py-1.5 pl-4 text-mf-ash-700 shadow-sm ring-1 ring-inset ring-mf-silver-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    disabled={createAccount.isLoading}
                    {...register("email", {
                      required: "Email address is required",
                      validate: (v) => v.includes("@") && v.includes("."),
                    })}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-mf-ash-700"
                >
                  Password
                </label>
                <div className="relative mt-2">
                  <input
                    id="password"
                    required
                    className="block w-full rounded-md border-0 bg-mf-milk-300 py-1.5 pl-4 text-mf-ash-700 shadow-sm ring-1 ring-inset ring-mf-silver-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    disabled={createAccount.isLoading}
                    placeholder="Password"
                    type={visable ? "text" : "password"}
                    {...register("password", {
                      required: "Password is Required",
                      minLength: {
                        value: 8,
                        message: "Password must be atleast 8 Characters",
                      },
                    })}
                  />
                  <button
                    tabIndex={-1}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setVisable((s) => !s);
                    }}
                    className="absolute bottom-0 right-3 top-0 text-mf-ash-500"
                  >
                    {visable ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <span className={errorStyle}>{errors.password?.message}</span>
              </div>

              <div>
                <label
                  htmlFor="password2"
                  className="block text-sm font-medium leading-6 text-mf-ash-700"
                >
                  Retype Password
                </label>
                <div className="relative mt-2">
                  <input
                    id="password2"
                    required
                    className="block w-full rounded-md border-0 bg-mf-milk-300 py-1.5 pl-4 text-mf-ash-700 shadow-sm ring-1 ring-inset ring-mf-silver-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    disabled={createAccount.isLoading}
                    placeholder="Password"
                    type={visable ? "text" : "password"}
                    {...register("password2", {
                      required: "Passwords must match",
                      minLength: {
                        value: 8,
                        message: "Password must be atleast 8 Characters",
                      },
                      validate: (v) =>
                        v === getValues("password")
                          ? true
                          : "Passwords must match",
                    })}
                  />
                  <button
                    tabIndex={-1}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setVisable((s) => !s);
                    }}
                    className="absolute bottom-0 right-3 top-0 text-mf-ash-500"
                  >
                    {visable ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <span className={errorStyle}>{errors.password2?.message}</span>
              </div>

              <div className="pt-4">
                <button
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-mf-milk-300 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  type="submit"
                  disabled={createAccount.isLoading}
                >
                  {createAccount.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
