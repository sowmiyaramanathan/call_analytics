import { useEffect, useState } from "react";
import TotalCallsChart from "./components/TotalCallsChart";
import { supabase } from "./lib/supabase";
import SadPathChart from "./components/SadPathChart";
import CallDurationChart from "./components/CallDurationChart";
import FailureStageChart from "./components/FailureStageChart";

const defaultCallData = [
  { day: "Mon", calls: 20 },
  { day: "Tue", calls: 35 },
  { day: "Wed", calls: 15 },
  { day: "Thur", calls: 50 },
  { day: "Fri", calls: 30 },
];

const defaultDurationData = [
  { day: "Mon", duration: 120 },
  { day: "Tue", duration: 210 },
  { day: "Wed", duration: 165 },
  { day: "Thu", duration: 240 },
  { day: "Fri", duration: 190 },
];

export default function App() {
  // UI state
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"calls" | "duration">("calls");

  // Form state
  const [email, setEmail] = useState("");
  const [value, setValue] = useState<number | "">("");

  // Chart state
  const [callData, setCallData] = useState(defaultCallData);
  const [durationData, setDurationData] = useState(defaultDurationData);

  // ESC to close panel
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const save = async () => {
    if (!email || value === "") {
      alert("Both fields are required");
      return;
    }

    const payload =
      mode === "calls" ? { email, calls: value } : { email, duration: value };

    const { data: existing } = await supabase
      .from("analytics")
      .select("*")
      .eq("email", email)
      .single();

    if (existing) {
      const prev = mode === "calls" ? existing.calls : existing.duration;

      if (prev !== null && !confirm(`Previous value: ${prev}. Overwrite?`)) {
        return;
      }
    }

    await supabase.from("analytics").upsert(payload);

    if (mode === "calls") {
      setCallData([
        { day: "Mon", calls: Number(value) },
        { day: "Tue", calls: Number(value) + 30 },
        { day: "Wed", calls: Number(value) - 15 },
        { day: "Thur", calls: Number(value) - 15 },
        { day: "Fri", calls: Number(value) + 40 },
      ]);
    } else {
      setDurationData([
        { day: "Mon", duration: Number(value) - 20 },
        { day: "Tue", duration: Number(value) },
        { day: "Wed", duration: Number(value) + 40 },
        { day: "Thu", duration: Number(value) - 10 },
        { day: "Fri", duration: Number(value) + 5 },
      ]);
    }

    // cleanup + close
    setEmail("");
    setValue("");
    setOpen(false);
    setMode("calls");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#4f46e5_0%,_#0b1020_60%)] text-white">
      <div className="w-full mx-auto px-8 py-16 space-y-16">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-semibold mb-2">Voice Agent Analytics</h1>
          <p className="text-white/70">
            Observability insights for voice agents
          </p>
        </div>

        {/* Charts Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6">
            <h3 className="text-sm uppercase tracking-wide text-white/60 mb-4">
              Total Call Volume (by weekdays)
            </h3>
            <TotalCallsChart data={callData} />
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6">
            <h3 className="text-sm uppercase tracking-wide text-white/60 mb-4">
              Total Call Duration in Seconds (by weekdays)
            </h3>
            <CallDurationChart data={durationData} />
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6">
            <h3 className="text-sm uppercase tracking-wide text-white/60 mb-4">
              Sad Path Analysis
            </h3>
            <SadPathChart />
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6">
            <h3 className="text-sm uppercase tracking-wide text-white/60 mb-4">
              Failure by Pipeline Stage
            </h3>
            <FailureStageChart />
          </div>
        </div>

        {/* Floating Button */}
        <button
          onClick={() => setOpen(true)}
          className="fixed top-6 right-6 bg-indigo-500 hover:bg-indigo-400 px-4 py-3 rounded-full shadow-lg"
        >
          Custom Data
        </button>

        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Slide-up Panel */}
        <div
          className={`fixed bottom-0 right-0 w-full sm:w-[380px] z-50 transition-transform duration-300 ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="bg-[#0b1020] border border-white/10 rounded-t-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm uppercase tracking-wide text-white/60">
                Custom Data
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Mode Switch */}
            <div className="flex gap-2 mb-4">
              {["calls", "duration"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m as any)}
                  className={`px-3 py-1 rounded text-sm ${
                    mode === m
                      ? "bg-indigo-500 text-white"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {m === "calls" ? "Call Volume" : "Duration"}
                </button>
              ))}
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/40 border border-white/10 rounded px-4 py-2 text-white placeholder-white/40"
              />

              <input
                type="number"
                placeholder={mode === "calls" ? "Calls" : "Duration (sec)"}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="bg-black/40 border border-white/10 rounded px-4 py-2 text-white placeholder-white/40"
              />

              <button
                onClick={save}
                className="bg-indigo-500 hover:bg-indigo-400 py-2 rounded font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
