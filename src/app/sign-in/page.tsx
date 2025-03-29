"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { reactClient } from "@/trpc/react";
import { useAuth } from "../_components/providers";

type Inputs = {
  email: string;
  password: string;
};
export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [visable, setVisable] = useState(false);
  const { refetch } = useAuth();

  const { register, handleSubmit } = useForm<Inputs>();
  const signIn = reactClient.account.signIn.useMutation({
    onError: (e) => {
      toast.error(e.message);
    },
    onSuccess: () => {
      refetch();
      const redirect = searchParams.get("redirect");
      router.push(redirect ?? "/");
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (signIn.isLoading) return;
    signIn.mutate(data);
  };
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-light leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-mf-milk-300 px-6 py-12 sm:rounded-lg sm:px-12 sm:shadow">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              action="#"
              method="POST"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
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
                    className="block w-full rounded-md border-0 bg-mf-milk-300 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    disabled={signIn.isLoading}
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
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="relative mt-2">
                  <input
                    id="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 bg-mf-milk-300 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    disabled={signIn.isLoading}
                    placeholder="Password"
                    type={visable ? "text" : "password"}
                    {...register("password", {
                      required: "Password is Required",
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
                    className="absolute bottom-0 right-3 top-0 text-gray-500"
                  >
                    {visable ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  className="flex h-9 w-full items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-semibold leading-6 text-mf-milk-300 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  type="submit"
                  disabled={signIn.isLoading}
                >
                  {signIn.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Sign in"
                  )}
                </button>
                <div className="pt-1 text-center text-sm text-gray-500">
                  <Link className="underline" href="/create-account">
                    Create an account
                  </Link>
                </div>
              </div>
            </form>

            <div>
              <div className="relative mt-10">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-mf-silver-700" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-mf-milk-300 px-6 text-gray-900">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href={`/sign-in/google${
                    searchParams.get("redirect")
                      ? `?redirect=${encodeURIComponent(
                          searchParams.get("redirect") ?? "",
                        )}`
                      : ""
                  }`}
                  className="border-1 flex w-full items-center justify-center gap-3 whitespace-nowrap rounded-md border border-gray-400 py-2"
                >
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  <span className="text-sm font-semibold leading-6 text-gray-900">
                    Google
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
