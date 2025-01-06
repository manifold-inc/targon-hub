interface Params {
  temperature: number;
  max_tokens: number;
  top_p: number;
}

interface ParameterControlsProps {
  params: Params;
  setParams: (params: Params) => void;
}

export function ParameterControls({
  params,
  setParams,
}: ParameterControlsProps) {
  return (
    <aside className="w-full border-b border-gray-200 lg:w-80 lg:border-b-0 lg:border-r">
      <div className="space-y-6 p-4">
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-600">
                Temperature
              </label>
              <span className="text-sm text-gray-500">
                {params.temperature}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={params.temperature}
              onChange={(e) =>
                setParams({
                  ...params,
                  temperature: parseFloat(e.target.value),
                })
              }
              className="w-full accent-orange-500"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-600">
                Max Tokens
              </label>
              <span className="text-sm text-gray-500">{params.max_tokens}</span>
            </div>
            <input
              type="range"
              min="64"
              max="1000"
              step="64"
              value={params.max_tokens}
              onChange={(e) =>
                setParams({ ...params, max_tokens: parseInt(e.target.value) })
              }
              className="w-full accent-orange-500"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-600">Top-P</label>
              <span className="text-sm text-gray-500">{params.top_p}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={params.top_p}
              onChange={(e) =>
                setParams({ ...params, top_p: parseFloat(e.target.value) })
              }
              className="w-full accent-orange-500"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
