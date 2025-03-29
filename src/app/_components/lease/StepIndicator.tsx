import { CheckIcon } from "lucide-react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Step = {
  name: string;
  status: "complete" | "current" | "upcoming";
};

interface StepIndicatorProps {
  steps: Step[];
}

export function StepIndicator({ steps }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="flex items-center justify-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={classNames(
              stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
              "relative",
            )}
          >
            {step.status === "complete" ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-green-500" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                  <CheckIcon
                    className="h-5 w-5 text-mf-milk-300"
                    aria-hidden="true"
                  />
                </div>
              </>
            ) : step.status === "current" ? (
              <div className="flex flex-row items-center">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-500 bg-mf-milk-300"
                  aria-current="step"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-green-500"
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap pt-16 text-sm font-semibold">
                    {step.name}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-mf-milk-300">
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                    aria-hidden="true"
                  />
                  <span className="hidden whitespace-nowrap pt-16 text-sm font-semibold sm:block">
                    {step.name}
                  </span>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
