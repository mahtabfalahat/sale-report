import { memo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './style.css' ;


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const SaleChart = ({ salesData }) => {
 

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'sale report bar chart',
            },
        },
    };

    const data = {
        labels: salesData.map(data => data.month),
        datasets: [

            {
                label: ' month ',
                data: salesData.map(data => data.sales),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <div className="chart-container">
            <Bar
                data={data}
                options={options}
            />
        </div>
    )
}

export default memo(SaleChart); 