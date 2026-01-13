import AllCustomer from "../../../components/dashboardComponent/AllCustomer";
import TotalSaleChart from "../../../components/dashboardComponent/TotalSaleChart";





const Overview = () => {


    return (
        <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="col-span-1">
                    <TotalSaleChart />
                </div>
                <div className="col-span-2">
                    <AllCustomer />
                </div>
                
            </div>
        </div>
    );
};

export default Overview;