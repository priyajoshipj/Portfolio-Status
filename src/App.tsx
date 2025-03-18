import React, { useCallback, useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SearchBar } from './components/SearchBar';
import { LoadMore } from './components/LoadMore';
import { PortfolioHealthWrapper } from './components/PortfolioHealth';
import { IProductData } from './types/portfolio';
import './App.css';

const PortfolioCard = lazy(() => import('./components/PortfolioCard'));

function App() {
  const [productData, setProductData] = useState<IProductData[] | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filterData = useCallback((data: IProductData[]) => {
    if (!searchTerm) return data;

    const term = searchTerm.toLowerCase();
    return data.filter(portfolio =>
      portfolio.name.toLowerCase().includes(term) ||
      portfolio.product?.some(prod =>
        prod.industry.toLowerCase().includes(term) ||
        prod.type.toLowerCase().includes(term) ||
        prod.name.toLowerCase().includes(term)
      )
    );
  }, [searchTerm]);

  const fetchProduct = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await fetch(`https://dummyjson.com/c/7955-b730-4bc3-84f5?page=${page}`);
      if (!response.ok) throw new Error('not valid');

      const data = await response.json();
      const newData = data.portfolios?.map((prod: IProductData) => ({
        name: prod.name,
        total_value: prod.total_value,
        created_at: prod.created_at,
        product: prod?.product,
      }));

      if (newData?.length) {
        setProductData(prev => prev ? [...prev, ...newData] : newData);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, page]);

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={
            <>
              <SearchBar onSearch={setSearchTerm} />
              <div>
                <h1>Top Portfolio of the month</h1>
                <Suspense fallback={<div className="loading-fallback">Loading...</div>}>
                  <div className="outerbox">
                    <PortfolioCard productData={productData ? filterData(productData) : null} />
                  </div>
                </Suspense>
                <LoadMore onLoadMore={fetchProduct} isLoading={isLoading} />
              </div>
            </>
          } />
          <Route
            path="/portfolio/:id"
            element={
              <Suspense fallback={<div className="loading-fallback">Loading...</div>}>
                <PortfolioHealthWrapper />
              </Suspense>
            }
          />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
