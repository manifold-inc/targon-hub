"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { CREDIT_PER_DOLLAR, MIN_PURCHASE_IN_DOLLARS } from "@/constants";
import { reactClient } from "@/trpc/react";

export function AddMoreCredits() {
  const [isOpen, setIsOpen] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const router = useRouter();
  const checkout = reactClient.credits.checkout.useMutation({
    onError: (e) => {
      toast.error(`Failed getting checkout session: ${e.message}`);
    },
    onSuccess: (url) => {
      router.push(url);
    },
  });

  function open() {
    setIsOpen(true);
  }

  function purchase() {
    checkout.mutate({ purchaseAmount: parseInt(purchaseAmount) });
  }
  const parsedCredits = purchaseAmount === "" ? 0 : parseInt(purchaseAmount);
  const validPurchase = parsedCredits >= MIN_PURCHASE_IN_DOLLARS;
  return (
    <>
      <Button
        onClick={open}
        className="h-fit rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Purchase Credits
      </Button>

      <Transition appear show={isOpen}>
        <Dialog
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={() => setIsOpen(false)}
        >
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 ">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 "
                enterTo="opacity-100 "
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0 "
              >
                <div className="absolute h-full w-full bg-neutral-300 bg-opacity-30 backdrop-blur-sm dark:bg-neutral-800 dark:bg-opacity-40" />
              </TransitionChild>
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl backdrop-blur-2xl dark:bg-white/5">
                  <DialogTitle
                    as="h3"
                    className="text-base/7 font-medium dark:text-white"
                  >
                    Purchase More Credits
                  </DialogTitle>
                  <div className="flex items-end gap-4 pt-2">
                    <div className="w-full">
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                      >
                        Price
                        <span className="pl-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                          ({CREDIT_PER_DOLLAR} Credits/Dollar)
                        </span>
                      </label>
                      <div className="relative mt-2 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          onChange={(e) =>
                            setPurchaseAmount(
                              e.target.value.replace(/[^0-9]/g, ""),
                            )
                          }
                          value={purchaseAmount}
                          type="text"
                          name="price"
                          id="price"
                          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:text-white sm:text-sm sm:leading-6"
                          placeholder="0.00"
                          aria-describedby="price-currency"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span
                            className="text-gray-500 dark:text-gray-300 sm:text-sm"
                            id="price-currency"
                          >
                            USD
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      disabled={!validPurchase || checkout.isLoading}
                      className="h-fit whitespace-nowrap rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 enabled:hover:bg-indigo-500 disabled:opacity-85"
                      onClick={purchase}
                    >
                      {checkout.isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Purchase Credits"
                      )}
                    </Button>
                  </div>
                  {validPurchase ? (
                    <div className="pt-1 text-sm">
                      {(parsedCredits * CREDIT_PER_DOLLAR).toLocaleString()}{" "}
                      Credits
                    </div>
                  ) : (
                    <div className="pt-1 text-sm text-red-500">
                      Minimum of {MIN_PURCHASE_IN_DOLLARS * CREDIT_PER_DOLLAR}{" "}
                      Credits (${MIN_PURCHASE_IN_DOLLARS})
                    </div>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
