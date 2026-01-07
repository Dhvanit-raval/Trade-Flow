import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart({ data }) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };
    return (
        <div style={{ height: "400px", width: "100%" }}>
            <Pie data={data} options={options} />
        </div>
    );
}
