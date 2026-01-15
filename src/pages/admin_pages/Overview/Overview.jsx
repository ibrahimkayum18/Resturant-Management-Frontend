import AllCustomer from "../../../components/dashboardComponent/AllCustomer";
import TotalSaleChart from "../../../components/dashboardComponent/TotalSaleChart";

const Overview = () => {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Page Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Sales Chart */}
        <div className="bg-white rounded-xl shadow p-4 md:p-5">
          <TotalSaleChart />
        </div>

        {/* All Customers */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-4 md:p-5">
          <AllCustomer />
        </div>

      </div>
    </div>
  );
};

export default Overview;
