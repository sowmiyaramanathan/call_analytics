import { useState } from "react";
import CallChart from "./components/CallChart";
import { supabase } from "./lib/supabase";
import SadPathChart from "./components/SadPathChart";

const defaultData = [
  { day: "Mon", calls: 20 },
  { day: "Tue", calls: 35 },
  { day: "Wed", calls: 15 },
  { day: "Thur", calls: 50 },
  { day: "Fri", calls: 30 },
];

export default function App() {
  const [email, setEmail] = useState("");
  const [calls, setCalls] = useState<number | "">("");
  const [chartData, setChartData] = useState(defaultData);

  const save = async () => {
    if (!email || calls === "") {
      alert("Email and Calls are required");
      return;
    }

    const { data: existing } = await supabase
      .from("analytics")
      .select("*")
      .eq("email", email)
      .single();

    if (existing) {
      if (!confirm(`Previous value: ${existing.calls}. Overwrite?`)) return;
    }

    await supabase.from("analytics").upsert({ email, calls });

    setChartData([
      { day: "Mon", calls: Number(calls) },
      { day: "Tue", calls: Number(calls) + 30 },
      { day: "Wed", calls: Number(calls) - 15 },
      { day: "Thur", calls: Number(calls) - 15 },
      { day: "Fri", calls: Number(calls) + 40 },
    ]);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#4f46e5_0%,_#0b1020_60%)] text-white">
      <div className="max-w-4xl mx-auto px-8 py-16 space-y-16">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-semibold mb-2">Voice Agent Analytics</h1>
          <p className="text-white/70"> Observability insights for voice agents</p>
        </div>

        {/* Input Fields */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center gap-4">
          <input
            type="email"
            placeholder="Email"
            className="w-80 bg-black/40 border border-white/10 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="number"
            placeholder="Calls"
            className="w-80 bg-black/40 border border-white/10 rounded px-4 py-2 text-white placeholder-white/40 focus:outline-none"
            onChange={(e) => setCalls(Number(e.target.value))}
          />

          <button
            onClick={save}
            className="bg-indigo-500 hover:bg-indigo-400 px-6 py-2 rounded"
          >
            Save
          </button>
        </div>

        {/* Chart Data */}
        <div className="bg-white/5 backdrop-blur rounded-2xl p-6">
          <h2 className="text-sm uppercase tracking-wide text-white/60 mb-8">
            Call Analytics
          </h2>
          <CallChart data={chartData} />
        </div>

        <div className="bg-white/5 backdrop-blur rounded-2xl p-6">
          <h2 className="text-sm uppercase tracking-wide text-white/60 mb-8">
            Sad Path Analysis
          </h2>
          <SadPathChart />
        </div>
      </div>
    </div>
  );
}
