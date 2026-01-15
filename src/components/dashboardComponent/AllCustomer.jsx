
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import useAllCustomers from "../../hooks/useAllCustomers";

const COLORS = ["#0088FE"];

const AllCustomer = () => {
  const [allCustomers] = useAllCustomers()



  /* ---------------- PIE CHART DATA ---------------- */
  const customerCount = allCustomers.filter(
    (user) => user?.role === "customer"
  ).length;

  const pieData = [{ name: "Total Customers", value: customerCount }];

  /* ---------------- BAR CHART DATA (GROWTH) ---------------- */
  const growthMap = {};

  allCustomers.forEach((user) => {
    if (user.activity?.createdAt) {
      const date = new Date(user.activity.createdAt)
        .toISOString()
        .split("T")[0]; // YYYY-MM-DD

      growthMap[date] = (growthMap[date] || 0) + 1;
    }
  });

  const barData = Object.keys(growthMap).map((date) => ({
    date,
    customers: growthMap[date],
  }));

  return (
  <div className="lg:flex gap-5 w-full">
    {/* ---------------- PIE CHART ---------------- */}
    <div className="w-full lg:w-1/3">
      <h2 className="text-xl font-bold text-center">Total Customers</h2>

      <div className="w-full h-[300px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius="80%"
              dataKey="value"
              labelLine={false}
              stroke="none"
              isAnimationActive={false}
              label={({ cx, cy }) => (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="60"
                  fontWeight="bold"
                  fill="#fff"
                >
                  {customerCount}
                </text>
              )}
            >
              <Cell fill="#0088FE" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* ---------------- BAR CHART ---------------- */}
    <div className="w-full lg:w-2/3">
      <h2 className="text-xl font-bold text-center">Customer Growth</h2>

      <div className="w-full h-[300px]">
        <ResponsiveContainer>
          <BarChart
            data={barData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="customers" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

};

export default AllCustomer;
