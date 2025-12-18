import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { stage: "Speech-to-Text", failures: 42 },
  { stage: "LLM Reasoning", failures: 28 },
  { stage: "Text-to-Speech", failures: 18 },
  { stage: "Network / Infrastructure", failures: 12 },
];

export default function FailureStageChart() {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 80, right: 20 }}
        >
          <XAxis type="number" />

          <YAxis
            dataKey="stage"
            type="category"
            stroke="rgba(255,255,255,0.7)"
            axisLine={false}
            tickLine={false}
            width={120}
          />

          <Tooltip
            cursor={false}
            contentStyle={{
              backgroundColor: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              padding: "6px 10px",
            }}
            labelStyle={{
                color: "rgba(255,255,255,0.9)",
                fontWeight: 500,
              }}
              itemStyle={{
                color: "#93c5fd",
                fontSize: "13px",
              }}
          />

          <Bar
            dataKey="failures"
            fill="#818cf8"
            radius={[6, 6, 6, 6]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
