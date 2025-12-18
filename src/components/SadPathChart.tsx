import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Caller Identification", value: 40 },
  { name: "Unsupported Language", value: 25 },
  { name: "User Refused Verification", value: 20 },
  { name: "Assistant Error", value: 15 },
];

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171"];

export default function SadPathChart() {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              color: "#ffffff",
              padding: "4px 8px",
            }}
            labelStyle={{
              color: "#e5e7eb",
              fontWeight: 600,
            }}
            itemStyle={{
              color: "#e5e7eb",
            }}

          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
