import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  ArrowUpDown,
  Binary,
  ChevronDown,
  ChevronUp,
  Hash,
  HelpCircle,
  Percent,
  Thermometer,
  X,
} from "lucide-react";

interface Params {
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
}

interface ParameterControlsProps {
  params: Params;
  setParams: (params: Params) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

function NumberInput({
  value = 0,
  onChange,
  min,
  max,
  step,
}: NumberInputProps) {
  const [localValue, setLocalValue] = useState(value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (newValue === "") return;

    const parsed = parseFloat(newValue);
    if (!isNaN(parsed)) {
      onChange(Math.min(Math.max(parsed, min), max));
    }
  };

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  return (
    <input
      type="number"
      min={min}
      max={max}
      step={step}
      value={localValue}
      onChange={handleChange}
      className="h-9 w-16 rounded-lg border-0 px-3 text-right text-sm font-semibold text-mf-blue-700 [appearance:textfield] hover:bg-mf-blue-900/10 focus:border-2 focus:border-black focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
  );
}

export function ParameterControls({
  params,
  setParams,
  isOpen,
  setIsOpen,
}: ParameterControlsProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const parameters = [
    {
      name: "Temperature",
      key: "temperature" as keyof Params,
      icon: Thermometer,
      min: 0,
      max: 2,
      step: 0.1,
      description: "Controls randomness: 0 is focused, 2 is more random",
    },
    {
      name: "Max Tokens",
      key: "max_tokens" as keyof Params,
      icon: Hash,
      min: 1,
      max: 2048,
      step: 1,
      description: "Maximum number of tokens to generate",
    },
    {
      name: "Top P",
      key: "top_p" as keyof Params,
      icon: Percent,
      min: 0,
      max: 1,
      step: 0.1,
      description: "Controls diversity via nucleus sampling",
    },
    {
      name: "Frequency Penalty",
      key: "frequency_penalty" as keyof Params,
      icon: ArrowUpDown,
      min: -2.0,
      max: 2.0,
      step: 0.1,
      description: "Reduces repetition of token frequencies",
    },
    {
      name: "Presence Penalty",
      key: "presence_penalty" as keyof Params,
      icon: Binary,
      min: -2.0,
      max: 2.0,
      step: 0.1,
      description: "Reduces repetition of topics and concepts",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={clsx(
          "fixed inset-y-0 right-0 z-50 w-[90%] max-w-[320px] transform bg-mf-milk-300 transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="border-b border-mf-silver-700 p-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-mf-ash-700">
              Parameters
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-mf-ash-500 hover:bg-mf-milk-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="h-[calc(100%-3.5rem)] overflow-y-auto p-3">
          {/* Parameters */}
          <div className="space-y-4">
            {parameters.map((param) => (
              <div key={param.key}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 font-medium text-gray-600">
                    <param.icon className="h-4 w-4 shrink-0" />
                    <span>{param.name}</span>
                  </label>
                  <NumberInput
                    value={params[param.key]}
                    onChange={(value) =>
                      setParams({ ...params, [param.key]: value })
                    }
                    min={param.min}
                    max={param.max}
                    step={param.step}
                  />
                </div>
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={params[param.key]}
                  onChange={(e) =>
                    setParams({
                      ...params,
                      [param.key]: parseFloat(e.target.value),
                    })
                  }
                  className="relative h-1.5 w-full cursor-pointer appearance-none rounded-full bg-mf-blue-900/10
                  before:absolute before:h-1.5 before:w-[var(--range-percent)] before:rounded-l-full
                  before:bg-mf-blue-900 before:content-[''] [&::-moz-range-progress]:h-1.5
                  [&::-moz-range-progress]:rounded-l-full [&::-moz-range-progress]:bg-mf-blue-900 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none
                  [&::-moz-range-thumb]:bg-mf-blue-900 [&::-moz-range-thumb]:outline-none [&::-moz-range-thumb]:transition-all hover:[&::-moz-range-thumb]:scale-110 [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:w-full [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-mf-blue-900/10 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-mf-blue-900 [&::-webkit-slider-thumb]:transition-all hover:[&::-webkit-slider-thumb]:scale-110"
                  style={
                    {
                      "--range-percent": `${((params[param.key] - param.min) / (param.max - param.min)) * 100}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>

          {/* Help Section */}
          <div className="mt-4 border-t border-mf-silver-700 pt-3">
            <button
              onClick={() => setIsHelpOpen(!isHelpOpen)}
              className="mb-2 flex w-full items-center justify-between text-xs font-semibold uppercase text-mf-ash-500 hover:text-mf-ash-500"
            >
              <div className="flex items-center space-x-2">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Understanding Parameters</span>
              </div>
              {isHelpOpen ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
            {isHelpOpen && (
              <div className="space-y-2">
                {parameters.map((param) => (
                  <div
                    key={`help-${param.key}`}
                    className="flex items-start space-x-2 rounded-lg py-1 text-xs text-mf-ash-500"
                  >
                    <param.icon className="mt-0.5 h-3 w-3 shrink-0" />
                    <div>
                      <span className="font-medium text-gray-600">
                        {param.name}
                      </span>
                      <p className="leading-snug">{param.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={clsx(
          "relative hidden overflow-hidden transition-[width] duration-300 ease-in-out lg:block",
          "border-r border-mf-silver-700 bg-mf-milk-100",
          isOpen ? "lg:w-80" : "lg:w-20",
        )}
      >
        <div
          className={clsx(
            "absolute inset-0 transition-opacity duration-200",
            isOpen
              ? "opacity-100 delay-200"
              : "opacity-0 lg:pointer-events-none",
          )}
        >
          <div className="flex w-full items-center justify-between p-4 text-sm font-medium text-gray-600 hover:text-mf-blue-700">
            <span className="whitespace-nowrap">Model Parameters</span>
            <button
              onClick={() => {
                setIsHelpOpen(false);
                setIsOpen(false);
              }}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Parameters */}
          <div className="space-y-6 p-4">
            {parameters.map((param) => (
              <div key={param.key}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 font-medium text-gray-600">
                    <param.icon className="h-5 w-5 shrink-0" />
                    <span>{param.name}</span>
                  </label>
                  <NumberInput
                    value={params[param.key]}
                    onChange={(value) =>
                      setParams({ ...params, [param.key]: value })
                    }
                    min={param.min}
                    max={param.max}
                    step={param.step}
                  />
                </div>
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={params[param.key]}
                  onChange={(e) =>
                    setParams({
                      ...params,
                      [param.key]: parseFloat(e.target.value),
                    })
                  }
                  className="relative h-1.5 w-full cursor-pointer appearance-none rounded-full bg-mf-ash-300/10
                  before:absolute before:h-1.5 before:w-[var(--range-percent)] before:rounded-l-full
                  before:bg-mf-ash-300 before:content-[''] [&::-moz-range-progress]:h-1.5
                  [&::-moz-range-progress]:rounded-l-full [&::-moz-range-progress]:bg-mf-blue-700 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none
                  [&::-moz-range-thumb]:bg-mf-ash-300 [&::-moz-range-thumb]:outline-none [&::-moz-range-thumb]:transition-all hover:[&::-moz-range-thumb]:scale-110 [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:w-full [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-mf-blue-700/10 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-mf-ash-300 [&::-webkit-slider-thumb]:transition-all hover:[&::-webkit-slider-thumb]:scale-110"
                  style={
                    {
                      "--range-percent": `${((params[param.key] - param.min) / (param.max - param.min)) * 100}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>

          {/* Help Section */}
          <div className="border-t border-mf-silver-700">
            <div className="p-4">
              <button
                onClick={() => setIsHelpOpen(!isHelpOpen)}
                className="mb-3 flex w-full items-center justify-between text-xs font-semibold uppercase text-mf-ash-500 hover:text-mf-ash-500"
              >
                <div className="flex items-center space-x-2">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Understanding Parameters</span>
                </div>
                {isHelpOpen ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>
              {isHelpOpen && (
                <div className="animate-slide-in space-y-3">
                  {parameters.map((param) => (
                    <div
                      key={`help-${param.key}`}
                      className="flex items-start space-x-2.5 rounded-lg p-2 text-xs text-mf-ash-500 transition-colors"
                    >
                      <param.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 transition-colors" />
                      <div>
                        <span className="font-medium text-gray-600 transition-colors">
                          {param.name}
                        </span>
                        <p className="mt-0.5 leading-relaxed">
                          {param.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={clsx(
            "absolute inset-0 transition-opacity duration-200",
            !isOpen
              ? "opacity-100 delay-200"
              : "opacity-0 lg:pointer-events-none",
          )}
        >
          <div className="flex h-full flex-row items-center justify-start space-x-6 overflow-x-auto p-4 text-gray-600 lg:flex-col lg:items-start lg:space-x-0 lg:space-y-6">
            <button
              onClick={() => setIsOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center transition-colors duration-200 hover:text-mf-blue-700"
            >
              <ChevronUp className="h-5 w-5 shrink-0" />
            </button>
            {parameters.map((param) => (
              <button
                key={param.key}
                onClick={() => setIsOpen(true)}
                className="flex h-9 w-9 shrink-0 items-center justify-center transition-colors duration-200 hover:text-mf-blue-700"
              >
                <param.icon className="h-5 w-5 shrink-0" />
              </button>
            ))}
            <button
              onClick={() => setIsOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center transition-colors duration-200 hover:text-mf-blue-700"
            >
              <HelpCircle className="h-5 w-5 shrink-0" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
