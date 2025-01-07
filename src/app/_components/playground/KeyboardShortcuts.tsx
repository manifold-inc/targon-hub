interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  if (!isOpen) return null;

  const shortcuts: ShortcutItem[] = [
    { keys: ["↑"], description: "Previous message" },
    { keys: ["↓"], description: "Next message" },
    { keys: ["p"], description: "Show/hide parameters" },
    { keys: ["Esc"], description: "Unfocus input" },
    { keys: ["Enter"], description: "Send message" },
    { keys: ["Shift", "+", "Enter"], description: "New line" },
    { keys: ["⌘/Ctrl"], description: "Show/hide shortcuts" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Keyboard Shortcuts
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="sr-only">Close</span>×
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Navigation</h4>
            <div className="space-y-2">
              {shortcuts.map((shortcut, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, j) => (
                      <span key={j}>
                        {key === "+" ? (
                          <span className="px-1 text-gray-400">{key}</span>
                        ) : (
                          <kbd className="inline-flex min-w-[1.5rem] items-center justify-center rounded-md border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-400">
                            {key}
                          </kbd>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
