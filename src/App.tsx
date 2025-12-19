import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import TotalCallsChart from "./components/TotalCallsChart";
import CallDurationChart from "./components/CallDurationChart";
import SadPathChart from "./components/SadPathChart";
import FailureStageChart from "./components/FailureStageChart";

type Mode = "calls" | "duration";

type DayValue = {
  day: string;
  value: number;
};

const defaultTotalCallData: DayValue[] = [
  { day: "Mon", value: 20 },
  { day: "Tue", value: 35 },
  { day: "Wed", value: 15 },
  { day: "Thu", value: 50 },
  { day: "Fri", value: 30 },
];

const defaultCallDurationData: DayValue[] = [
  { day: "Mon", value: 120 },
  { day: "Tue", value: 210 },
  { day: "Wed", value: 165 },
  { day: "Thu", value: 240 },
  { day: "Fri", value: 190 },
];

export default function App() {
  // UI state
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("calls");

  // user identity
  const [email, setEmail] = useState("");

  // draft for custom data panel
  const [draftCallData, setDraftCallData] = useState<DayValue[]>([]);
  const [draftDurationData, setDraftDurationData] = useState<DayValue[]>([]);

  // committed data for charts
  const [callData, setCallData] = useState<DayValue[]>(defaultTotalCallData);
  const [durationData, setDurationData] = useState<DayValue[]>(
    defaultCallDurationData
  );

  const [showConfirm, setShowConfirm] = useState(false);
  const [prevSeries, setPrevSeries] = useState<any[]>([]);
  const [pendingSave, setPendingSave] = useState(false);

  // ESC key to close panel
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  useEffect(() => {
    if (pendingSave) {
      save();
    }
  }, [pendingSave]);

  const openPanel = async () => {
    setDraftCallData(JSON.parse(JSON.stringify(callData)));
    setDraftDurationData(JSON.parse(JSON.stringify(durationData)));
    setOpen(true);
  };

  const closePanel = () => {
    setDraftCallData([]);
    setDraftDurationData([]);
    setOpen(false);
  };

  const save = async () => {
    if (!email) {
      alert("Email is required");
      return;
    }

    // fetch existing data
    const { data: existing } = await supabase
      .from("analytics")
      .select("*")
      .eq("email", email)
      .single();

    if (existing && !pendingSave) {
      const series =
        mode === "calls" ? existing.call_series : existing.duration_series;

      if (Array.isArray(series) && series.length > 0) {
        setPrevSeries(series);
        setShowConfirm(true);
        return;
      }
    }

    const payload = {
      email,
      call_series: draftCallData,
      duration_series: draftDurationData,
      updated_at: new Date().toISOString(),
    };

    await supabase.from("analytics").upsert(payload);

    // close panel and commit
    setCallData(draftCallData);
    setDurationData(draftDurationData);
    setPendingSave(false);
    setPrevSeries([]);
    closePanel();
  };

  const activeDraft = mode === "calls" ? draftCallData : draftDurationData;
  const setActiveDraft =
    mode === "calls" ? setDraftCallData : setDraftDurationData;

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
              Call Volume
            </h3>
            <TotalCallsChart
              data={callData.map((d) => ({
                day: d.day,
                calls: d.value,
              }))}
            />
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6">
            <h3 className="text-sm uppercase text-white/60 mb-4">
              Call Duration in Seconds
            </h3>
            <CallDurationChart
              data={durationData.map((d) => ({
                day: d.day,
                duration: d.value,
              }))}
            />
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6">
            <h3 className="text-sm uppercase text-white/60 mb-4">
              Sad Path Analysis
            </h3>
            <SadPathChart />
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6">
            <h3 className="text-sm uppercase text-white/60 mb-4">
              Failure by Pipeline Stage
            </h3>
            <FailureStageChart />
          </div>
        </div>

        {/* Floating Button */}
        <button
          onClick={openPanel}
          className="fixed top-6 right-6 bg-indigo-500 hover:bg-indigo-400 px-4 py-3 rounded-full shadow-lg"
        >
          Custom Data
        </button>

        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={closePanel}
          />
        )}

        {/* Slide-up Panel */}
        <div
          className={`fixed bottom-0 right-0 w-full sm:w-[420px] z-50 transition-transform duration-300 ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="bg-[#0b1020] border border-white/10 rounded-t-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm uppercase tracking-wide text-white/60">
                Input Custom Data
              </h2>
              <button
                onClick={closePanel}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 bg-black/40 border border-white/10 rounded px-4 py-2"
            />

            {/* Total Calls or Duration value */}
            <div className="flex gap-2 mb-4">
              {["calls", "duration"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m as Mode)}
                  className={`px-3 py-1 rounded text-sm ${
                    mode === m ? "bg-indigo-500" : "bg-white/10 text-white/70"
                  }`}
                >
                  {m === "calls" ? "Call Volume" : "Duration"}
                </button>
              ))}
            </div>

            {/* Chart Data Input */}
            <div className="grid grid-cols-2 gap-4">
              {activeDraft.map((item, idx) => (
                <div key={item.day}>
                  <label className="text-xs text-white/60">{item.day}</label>
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setActiveDraft((prev) =>
                        prev.map((d, i) => (i === idx ? { ...d, value: v } : d))
                      );
                    }}
                    className="mt-1 w-full bg-black/40 border border-white/10 rounded px-3 py-1"
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6">
              <button onClick={closePanel} className="text-white/60">
                Cancel
              </button>
              <button
                onClick={save}
                className="bg-indigo-500 px-4 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Displaying overwrite confirmation */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-[#0b1020] p-6 rounded-xl border border-white/10 w-[360px]">
              <h3 className="text-sm text-white/80 mb-2">
                Previous data exists
              </h3>

              <div className="text-xs text-white/60 mb-4 space-y-1">
                {prevSeries.map((d) => (
                  <div key={d.day} className="flex justify-between">
                    <span>{d.day}</span>
                    <span>{d.value}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-white/50 mb-4">
                Do you want to overwrite this data?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setPrevSeries([]);
                  }}
                  className="text-white/60"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setPendingSave(true);
                  }}
                  className="bg-indigo-500 px-4 py-1 rounded"
                >
                  Overwrite
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
