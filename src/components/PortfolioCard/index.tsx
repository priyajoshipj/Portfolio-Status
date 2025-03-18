import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { IProductData } from '../../types/portfolio';
import './styles.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface PortfolioCardProps {
    productData: IProductData[] | null | undefined;
}

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Product Volumes',
        },
    },
};

const PortfolioCard: React.FC<PortfolioCardProps> = ({ productData }) => {
    const navigate = useNavigate();

    const handleCardClick = (portfolio: IProductData) => {
        navigate(`/portfolio/${portfolio.name.toLowerCase().replace(/\s+/g, '-')}`, { state: { portfolio } });
    };

    const handleKeyPress = (event: React.KeyboardEvent, portfolio: IProductData) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleCardClick(portfolio);
        }
    };

    return (
        <>
            {productData?.map((item, index) => {
                const chartData = {
                    labels: item.product?.map(p => p.name) || [],
                    datasets: [{
                        label: 'Volume',
                        data: item.product?.map(p => p.volume) || [],
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        borderColor: 'rgb(53, 162, 235)',
                        borderWidth: 1,
                    }],
                };

                return (
                    <div
                        key={index}
                        className="portfolio-card"
                        onClick={() => handleCardClick(item)}
                        onKeyPress={(e) => handleKeyPress(e, item)}
                        role="button"
                        tabIndex={0}
                    >
                        <h3>{item.name}</h3>
                        <p>Total Value: ${item.total_value.toLocaleString()}</p>
                        <p>Created: {new Date(item.created_at).toLocaleDateString()}</p>

                        <div className="chart-container">
                            <Line options={options} data={chartData} />
                        </div>

                        <div className="products-grid">
                            {item.product?.map((prod, idx) => (
                                <div key={idx} className="product-item">
                                    <img
                                        src={prod.image_url}
                                        alt={prod.name}
                                        loading="lazy"
                                    />
                                    <h4>{prod.name}</h4>
                                    <p>Symbol: {prod.symbol}</p>
                                    <p>Type: {prod.type}</p>
                                    <p>Volume: {prod.volume.toLocaleString()}</p>
                                    <p>Price: ${prod.current_price.toLocaleString()}</p>
                                    <p>Industry: {prod.industry}</p>
                                    {prod.maturity_date && (
                                        <p>Maturity: {new Date(prod.maturity_date).toLocaleDateString()}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default PortfolioCard; 