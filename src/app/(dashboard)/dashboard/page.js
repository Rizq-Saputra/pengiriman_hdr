import TotalPengirimanCard from "./TotalPengirimanCard";
import ChartComponent from "./ChartComponent";

export default function Dashboard() {
  return (
    <div className="p-8 w-full">
      <TotalPengirimanCard />
      <ChartComponent />
    </div>
  );
}
