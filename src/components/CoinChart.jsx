import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import Spinner from './Spinner';
const API_URL = import.meta.env.VITE_COIN_API_URL;

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

const CoinChart = ({ coinId }) => {
  const [chartData, setChartDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(`${API_URL}/${coinId}/market_chart?vs_currency=eur&days=7`);
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        const prices = data.prices.map((price) => ({
          x: price[0],
          y: price[1],
        }));
        console.log('prices : ', prices);
        setChartDate({
          datasets: [
            {
              label: 'Price (EUR)',
              data: prices,
              fill: true,
              borderColor: '#007bff',
              backgroundColor: 'rgba(0, 123, 255, 0.1)',
              pointRadius: 0,
              tension: 0.3,
            },
          ],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [coinId]);

  if (loading) return <Spinner />;

  return (
    <div style={{ marginTop: '30px' }}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false },
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 7,
              },
            },
            y: {
              ticks: {
                callback: (value) => `${value.toLocaleString()} €`,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default CoinChart;
