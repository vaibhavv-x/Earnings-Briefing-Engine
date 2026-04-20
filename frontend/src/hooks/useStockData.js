import { useState, useCallback, useEffect } from 'react';
import { getCompanyInfo, getPredictions } from '../services/api';

export const useStockData = () => {
    const [symbol, setSymbol] = useState(localStorage.getItem('lastSymbol') || 'AAPL');
    const [companyInfo, setCompanyInfo] = useState(null);
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStockData = useCallback(async (ticker) => {
        if (!ticker) return;
        setLoading(true);
        setError(null);
        try {
            const [companyData, predictionData] = await Promise.all([
                getCompanyInfo(ticker),
                getPredictions(ticker)
            ]);
            setCompanyInfo(companyData);
            setPredictions(predictionData);
            setSymbol(ticker.toUpperCase());
            localStorage.setItem('lastSymbol', ticker.toUpperCase());
        } catch (err) {
            console.error(err);
            setError('Failed to fetch data for the requested ticker. Please check the symbol and try again.');
            setCompanyInfo(null);
            setPredictions(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (symbol) {
            fetchStockData(symbol);
        }
    }, []);

    return {
        symbol,
        companyInfo,
        predictions,
        loading,
        error,
        fetchStockData
    };
};
