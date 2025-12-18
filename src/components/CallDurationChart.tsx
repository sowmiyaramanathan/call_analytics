import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: { day: string; duration: number }[];
};

export default function CallDurationChart({ data }: Props) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          
          <XAxis
            dataKey="day"
            stroke="rgba(255, 255, 255, 0.4"
            axisLine={false}
            tickLine={false}
            padding={{ left: 20, right: 20 }}
          />

          <YAxis
            stroke="rgba(255, 255, 255, 0.4"
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

          <Line
            type="monotone"
            dataKey="duration"
            stroke="#a4b4fc"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
