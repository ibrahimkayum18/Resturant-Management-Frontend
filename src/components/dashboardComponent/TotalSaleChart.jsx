import { PieChart, Pie, Cell } from 'recharts';
import totalSale from './../../assets/totalSale.json';

const TotalSaleChart = () => {
  // Calculate total sale amount
  const totalAmount = totalSale.reduce(
    (sum, order) => sum + (order.pricing?.grandTotal || 0),
    0
  );

  const pieData = [{ name: 'Total Sale', value: totalAmount }];

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Total Sale</h2>

      <PieChart width={300} height={300}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius={120}
          dataKey="value"
          stroke="none"        // ✅ removes seam line
          labelLine={false}    // ✅ removes label line
          isAnimationActive={false}
          label={({ cx, cy }) => (
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="26"
              fontWeight="bold"
              fill="#fff"
            >
              ৳{totalAmount.toLocaleString()}
            </text>
          )}
        >
          <Cell fill="#0088FE" />
        </Pie>
      </PieChart>
    </div>
  );
};

export default TotalSaleChart;
