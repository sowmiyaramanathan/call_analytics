import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: { day: string; calls: number }[];
};

export default function TotalCallsChart({ data }: Props) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="callsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="day"
            stroke="rgba(255,255,255,0.4)"
            axisLine={false}
            tickLine={false}
            padding={{ left: 20, right: 20 }}
          />

          <YAxis
            stroke="rgba(255,255,255,0.4)"
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.2)", strokeWidth: 1 }}
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              padding: "4px 8px",
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

          <Area
            type="monotone"
            dataKey="calls"
            stroke="#60a5fa"
            fill="url(#callsGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
