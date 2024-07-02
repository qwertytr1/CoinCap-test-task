import { CurrencyEntity } from 'app/interfaces';
import React, { useEffect, useState, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import './Header.scss';

const Header: React.FC = () => {
  const {
    portfolio,
    coins,
    portfolioCostDifference,
    handleOpenPortfolio,
  } = usePortfolio();
  const [topThreeCryptos, setTopThreeCryptos] = useState<CurrencyEntity[]>([]);
  const [initialPortfolioValue, setInitialPortfolioValue] = useState<number>(0);
  const [updatedCryptoIds, setUpdatedCryptoIds] = useState<string[]>([]);
  const prevTopThreeCryptos = useRef<CurrencyEntity[]>([]);

  useEffect(() => {
    const initialValue = portfolio.reduce((acc, coin) => acc + (coin.purchasePrice * (coin.quantity || 0)), 0);
    setInitialPortfolioValue(initialValue);
  }, [portfolio]);

  useEffect(() => {
    if (coins.length > 0) {
      const sortedCryptoRates = [...coins].sort((a, b) => parseFloat(b.priceUsd) - parseFloat(a.priceUsd));
      const topThree = sortedCryptoRates.slice(0, 3);
      setTopThreeCryptos(topThree);

      const updatedIds = topThree.filter(crypto => {
        const existingCrypto = prevTopThreeCryptos.current.find(c => c.id === crypto.id);
        return existingCrypto && existingCrypto.priceUsd !== crypto.priceUsd;
      }).map(crypto => crypto.id);
      setUpdatedCryptoIds(updatedIds);
      prevTopThreeCryptos.current = topThree;
    }
  }, [coins]);

  const portfolioChange = portfolioCostDifference - initialPortfolioValue;
  const portfolioChangePercentage = initialPortfolioValue !== 0 ? ((portfolioChange / initialPortfolioValue) * 100).toFixed(2) : '0.00';

  return (
    <div className="header">
      <div className="crypto-rates-container">
        <div className="crypto-rates">
          {topThreeCryptos.map(crypto => (
            <div key={crypto.id} className="ticker">
              <strong>{crypto.name}:</strong>
              <span
                className={`price ${updatedCryptoIds.includes(crypto.id) ? 'updated' : ''}`}
                onAnimationEnd={() => setUpdatedCryptoIds(prev => prev.filter(id => id !== crypto.id))}
              >
                ${crypto.priceUsd}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="portfolio-value" onClick={handleOpenPortfolio}>
        {portfolioCostDifference.toFixed(2)} USD {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)} ({portfolioChangePercentage}%)
      </div>
    </div>
  );
};

export default Header;
