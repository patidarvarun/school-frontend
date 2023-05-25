import { useState } from "react";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";
ChartJS.register(
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);

export default function TaskChart() {
  const [data, setData] = useState({
    labels: ["Jan", "Feb", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "First Dataset",
        data: [40, 50, 55, 60, 51, 82, 70, 59, 61, 73, 50, 30],
        borderColor: "purple",
        tension: 0.4,
        fill: true,
        pointStyle: "rect",
        pointBorderColor: "blue",
        pointBackgroundColor: "#fff",
        showLine: true,
      },
      {
        label: "First Dataset",
        data: [5, 5, 10, 10, 12, 14, 16, 18, 20, 30, 35, 40],
        borderColor: "pink",
        tension: 0.4,
        fill: true,
        pointStyle: "rect",
        pointBorderColor: "blue",
        pointBackgroundColor: "#fff",
        showLine: true,
      },
    ],
  });

  return (
    <>
      <Line data={data}></Line>
    </>
  );
}
