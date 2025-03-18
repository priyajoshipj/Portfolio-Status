import React from 'react';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface IPortFolioProduct {
  id: number;
  name: string;
  symbol: string;
  type: string;
  volume: number;
  current_price: number;
  industry: string;
  image_url: string;
  maturity_date?: Date;
}

export interface IProductData {
  name: string;
  total_value: number;
  created_at: Date;
  product?: IPortFolioProduct[];
}

interface ProductCardProps {
  productData: IProductData[] | null | undefined;
}

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const ProductCard: React.FC<ProductCardProps> = ({ productData }) => {
  return (
    <>
      {productData?.map((val, index) => {
        // Prepare BarChart data
        const productNames = val?.product?.map((p) => p.name) || [];
        const productVolumes = val?.product?.map((p) => p.volume) || [];

        const data = {
          productNames,
          datasets: [
            {
              label: 'Dataset 1',
              data: productNames.map(() => productVolumes),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Dataset 2',
              data: productNames.map(() => productVolumes),
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
          ],
        };

        return (
          <div key={index} className="portfolio-card">
            <span> Portfolio Name : {val.name} </span>
            <span> Total Value: {Math.floor(val.total_value)} </span>

            <div className="portfolio-card-products">
              {val?.product?.map((value, key) => (
                <div key={key} className="portfolio-card-product">
                  <span> {value.id} </span>
                  <span> {value.industry} </span>
                  <span> {value.name} </span>
                  <span> {value.symbol} </span>
                  <span> {value.volume} </span>
                  <span> {value.type} </span>
                  <span>
                    <img
                      src={value.image_url}
                      loading="lazy"
                      alt={value.name}
                    />
                  </span>
                </div>
              ))}
              <Line options={options} data={data} />
              {/* Render BarChart Inside portfolio-card-products */}
              {/* {val?.product?.length > 0 && (
                <div className="chart-container">
                  <BarChart
                    xAxis={[
                      {
                        scaleType: 'band',
                        data: productNames, // X-Axis: Product Names
                      },
                    ]}
                    series={[
                      {
                        data: productVolumes, // Y-Axis: Product Volumes
                        label: 'Volume',
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                </div>
              )} */}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ProductCard;
