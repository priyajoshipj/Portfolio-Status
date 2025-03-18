import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { useLocation, useNavigate } from 'react-router-dom';
import { IProductData } from '../../types/portfolio';
import './styles.css';

// Add wrapper component
export const PortfolioHealthWrapper: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const portfolio = location.state?.portfolio as IProductData;

    if (!portfolio) {
        React.useEffect(() => {
            navigate('/');
        }, [navigate]);
        return <div className="loading-fallback">Redirecting...</div>;
    }

    return <PortfolioHealth portfolio={portfolio} />;
};

interface PortfolioHealthProps {
    portfolio: IProductData;
}

// Fix type issues in assetTypeDistribution
type AssetType = 'commodities' | 'equities' | 'bonds';

export const PortfolioHealth: React.FC<PortfolioHealthProps> = ({ portfolio }) => {
    // Calculate portfolio metrics
    const assetTypeDistribution: Record<AssetType, number> = {
        commodities: 0,
        equities: 0,
        bonds: 0
    };

    const totalValue = portfolio.total_value;

    portfolio.product.forEach(product => {
        const productValue = product.current_price * product.volume;
        assetTypeDistribution[product.type as AssetType] += productValue;
    });

    // Convert to percentages
    Object.keys(assetTypeDistribution).forEach(key => {
        assetTypeDistribution[key as AssetType] = (assetTypeDistribution[key as AssetType] / totalValue) * 100;
    });

    // Risk assessment based on asset distribution
    const riskScore = calculateRiskScore(assetTypeDistribution);

    // Historical performance data (mock data - in real app, this would come from API)
    const performanceData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Portfolio Value',
            data: [totalValue * 0.95, totalValue * 0.97, totalValue * 0.99, totalValue, totalValue * 1.02, totalValue * 1.05],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    // Asset allocation chart data
    const allocationData = {
        labels: ['Commodities', 'Equities', 'Bonds'],
        datasets: [{
            data: Object.values(assetTypeDistribution),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
    };

    return (
        <div className="portfolio-health-container">
            <div className="portfolio-header">
                <h2>{portfolio.name}</h2>
                <p className="creation-date">Created: {new Date(portfolio.created_at).toLocaleDateString()}</p>
            </div>

            <div className="health-metrics">
                <div className="metric-card">
                    <h3>Portfolio Value</h3>
                    <p className="value">${totalValue.toLocaleString()}</p>
                </div>
                <div className="metric-card">
                    <h3>Risk Score</h3>
                    <p className={`value risk-${getRiskLevel(riskScore)}`}>
                        {riskScore}/100
                    </p>
                </div>
                <div className="metric-card">
                    <h3>Diversification Score</h3>
                    <p className="value">{calculateDiversificationScore(portfolio)}/100</p>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-card">
                    <h3>Asset Allocation</h3>
                    <Doughnut data={allocationData} />
                </div>
                <div className="chart-card">
                    <h3>Historical Performance</h3>
                    <Line data={performanceData} />
                </div>
            </div>

            <div className="holdings-breakdown">
                <h3>Holdings Breakdown</h3>
                <div className="holdings-grid">
                    {portfolio.product.map(product => (
                        <div key={product.id} className="holding-card">
                            <img src={product.image_url} alt={product.name} />
                            <div className="holding-info">
                                <h4>{product.name}</h4>
                                <p>Type: {product.type}</p>
                                <p>Value: ${(product.current_price * product.volume).toLocaleString()}</p>
                                <p>Weight: {((product.current_price * product.volume / totalValue) * 100).toFixed(2)}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Helper functions
function calculateRiskScore(distribution: any): number {
    // Higher weights in equities and commodities increase risk
    const riskWeights = {
        commodities: 0.4,
        equities: 0.35,
        bonds: 0.25
    };

    const score = Object.entries(distribution).reduce((total, [type, percentage]) => {
        return total + (percentage as number) * riskWeights[type as AssetType];
    }, 0);

    return Math.min(Math.round(score), 100);
}

function getRiskLevel(score: number): string {
    if (score < 30) return 'low';
    if (score < 70) return 'medium';
    return 'high';
}

function calculateDiversificationScore(portfolio: IProductData): number {
    const industryCount = new Set(portfolio.product.map(p => p.industry)).size;
    const typeCount = new Set(portfolio.product.map(p => p.type)).size;
    const productCount = portfolio.product.length;

    // Score based on industry diversity, asset type diversity, and number of products
    const score = (industryCount * 20) + (typeCount * 20) + (productCount * 10);
    return Math.min(Math.round(score), 100);
} 