import {
  useCallback,
  useEffect,
  useState,
  lazy,
  Suspense,
  useRef,
} from 'react';
import './App.css';
import { IProductData } from './ProductCard';

const ProductCardLazy = lazy(() => import('./ProductCard'));
function App() {
  const [productData, setProductData] = useState<IProductData[] | null>();
  const loadMoreDataRef = useRef(null);

  const fetchProduct = useCallback(async () => {
    const response = await fetch('https://dummyjson.com/c/7955-b730-4bc3-84f5');
    if (!response.ok) {
      throw new Error('not valid');
    }

    const data = await response.json();

    const filterData: IProductData[] = data.portfolios?.map(
      (prod: IProductData) => {
        return {
          name: prod.name,
          total_value: prod.total_value,
          created_at: prod.created_at,
          product: prod?.product,
        };
      }
    );
    if (filterData) {
      setProductData(filterData);
    }
  }, []);

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    if (productData) {
      console.warn('hereeee');
      const observer = new IntersectionObserver(
        (enteries) => {
          if (enteries[0].isIntersecting) {
            console.warn('reach at the end');
            fetchProduct();
          }
        },
        {
          root: null,
          threshold: 0.5,
        }
      );
      if (loadMoreDataRef.current) {
        observer.observe(loadMoreDataRef.current);
      }

      return () => {
        if (loadMoreDataRef.current) {
          observer.disconnect();
        }
      };
    }
  }, [productData]);

  return (
    <>
      <div>
        <Suspense fallback={'data is loading...'}>
          <div className="outerbox">
            <ProductCardLazy productData={productData} />
          </div>
        </Suspense>
        <div ref={loadMoreDataRef}> Load more data.... </div>
      </div>
    </>
  );
}

export default App;
