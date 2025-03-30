import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CodeIcon,
  MessageSquareIcon,
  SlidersHorizontal,
} from "lucide-react";

interface PlaygroundNavProps {
  nav: string;
  setNav: (nav: string) => void;
  current_model: string | null;
  setSelected: (model: string) => void;
  isParamsOpen: boolean;
  setIsParamsOpen: (open: boolean) => void;
  models: {
    data?: Array<{ name: string | null; supportedEndpoints: string[] }>;
    isLoading?: boolean;
  };
}

const baseButtonStyles =
  "flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold leading-tight focus:outline-none";
const selectedButtonStyles = "text-mf-ash-500 bg-mf-blue-500";
const unselectedButtonStyles =
  "text-mf-ash-500 opacity-80 hover:bg-mf-blue-900/5";

export function PlaygroundNav({
  nav,
  setNav,
  current_model,
  setSelected,
  isParamsOpen,
  setIsParamsOpen,
  models,
}: PlaygroundNavProps) {
  const NavButton = ({
    type,
    icon: Icon,
  }: {
    type: "ui" | "code";
    icon: typeof CodeIcon;
  }) => (
    <button
      onClick={() => setNav(type)}
      className={clsx(
        baseButtonStyles,
        "h-10 w-24 lg:h-9",
        nav === type ? selectedButtonStyles : unselectedButtonStyles,
      )}
    >
      <Icon className="h-4 w-4" />
      {type === "ui" ? "Chat" : "Code"}
    </button>
  );

  return (
    <nav className="flex flex-col border-b border-mf-silver-700 bg-mf-milk-100 py-10 lg:h-14 lg:flex-row lg:items-center">
      {/* Navigation Buttons */}
      <div className="flex items-center gap-2 p-4 lg:p-0 lg:px-4">
        <NavButton type="ui" icon={MessageSquareIcon} />
        <NavButton type="code" icon={CodeIcon} />
        <button
          onClick={() => setIsParamsOpen(!isParamsOpen)}
          className={clsx(
            baseButtonStyles,
            "ml-auto h-10 w-32 lg:hidden",
            isParamsOpen ? selectedButtonStyles : unselectedButtonStyles,
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Parameters</span>
        </button>
      </div>

      {/* Model Selector */}
      <div className="w-full px-4 py-3 lg:ml-auto lg:max-w-96 lg:py-0">
        <Listbox value={current_model} onChange={setSelected}>
          <div className="relative">
            <ListboxButton
              className={clsx(
                "flex w-full items-center justify-between rounded-full px-4 py-2.5 text-sm font-semibold lg:px-3 lg:py-2",
                "bg-mf-blue-500 focus:outline-none",
                current_model && "text-mf-ash",
                !current_model && "text-mf-ash-500",
              )}
            >
              {({ open }) => (
                <>
                  <div className="flex min-w-0 items-center gap-2">
                    <div
                      className={clsx(
                        "h-2 w-2 shrink-0 rounded-full",
                        current_model ? "bg-mf-blue-700" : "bg-mf-ash-500",
                      )}
                    />
                    <span className="truncate">
                      {models.isLoading
                        ? "Loading models..."
                        : (current_model ?? "Select a model")}
                    </span>
                  </div>
                  {open ? (
                    <ChevronUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  ) : (
                    <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  )}
                </>
              )}
            </ListboxButton>

            <ListboxOptions className="scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 absolute right-0 z-10 mt-2 max-h-64 w-full overflow-y-auto rounded-xl bg-mf-milk-300 py-2 shadow-lg ring-1 ring-black/5 focus:outline-none">
              {models.data?.map((model) => (
                <ListboxOption
                  key={model.name}
                  value={model.name}
                  className={({ selected }) =>
                    clsx(
                      "relative cursor-pointer select-none px-4 py-3 hover:bg-mf-blue-900/5 lg:py-2.5",
                      selected && "bg-mf-blue-900/10",
                    )
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center justify-between">
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <div
                          className={clsx(
                            "h-2 w-2 shrink-0 rounded-full",
                            selected ? "bg-mf-blue-700" : "bg-mf-ash-500",
                          )}
                        />
                        <span
                          className={clsx(
                            "block truncate text-sm",
                            selected
                              ? "font-semibold text-mf-blue-700"
                              : "text-mf-ash-500",
                          )}
                        >
                          {model.name}
                        </span>
                      </div>
                      {selected && (
                        <CheckIcon className="ml-2 h-4 w-4 shrink-0 text-mf-blue-700" />
                      )}
                    </div>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
    </nav>
  );
}
