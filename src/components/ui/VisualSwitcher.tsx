import { useState, useRef, useEffect } from "react";
import { Settings, Sparkles, Stars, Layers, Check } from "lucide-react";

interface VisualSwitcherProps {
  currentMode: "3d" | "stars" | "aura";
  onChangeMode: (mode: "3d" | "stars" | "aura") => void;
}

export function VisualSwitcher({ currentMode, onChangeMode }: VisualSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    {
      id: "3d",
      name: "3D Interactive",
      desc: "Interactive particle grid",
      icon: Sparkles,
    },
    {
      id: "stars",
      name: "Parallax Stars",
      desc: "Canvas floating starfield",
      icon: Stars,
    },
    {
      id: "aura",
      name: "Fluid Aura",
      desc: "Deep ambient gradient mesh",
      icon: Layers,
    },
  ] as const;

  return (
    <div ref={containerRef} className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      {isOpen && (
        <div className="mb-3 w-64 bg-[#0a0a0c]/90 border border-white/10 backdrop-blur-xl rounded-2xl p-3 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-2.5 pb-2 border-b border-white/5">
            Background Visuals
          </div>
          <div className="mt-2 space-y-1">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isActive = currentMode === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    onChangeMode(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between text-left px-2.5 py-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-brand-500/10 text-white border border-brand-500/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${isActive ? "text-brand-400" : "text-gray-500"}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-medium">{opt.name}</div>
                      <div className="text-[10px] text-gray-500 leading-tight mt-0.5">{opt.desc}</div>
                    </div>
                  </div>
                  {isActive && <Check size={14} className="text-brand-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3.5 rounded-full bg-brand-500 text-white shadow-lg hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] hover:bg-brand-500/90 transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95"
        aria-label="Customize Visual Background"
      >
        <Settings size={20} className={`${isOpen ? "rotate-45" : "animate-spin-slow"} transition-transform duration-300`} />
      </button>
    </div>
  );
}
