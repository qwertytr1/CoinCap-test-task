import React, { useState, useEffect } from 'react';
import Header from './app/header/header';
import PortfolioButton from './app/modul/PortfolioButton';
import CoinTable from './app/coinTable';
import PortfolioModal from './app/modul/modulPage';
import AddCoinsModal from './app/modul/addCoins';
import { CurrencyEntity } from './app/interfaces';
import { httpGet } from './app/api/apiHandler';

const App: React.FC = () => {
  const [portfolioVisible, setPortfolioVisible] = useState<boolean>(false);
  const [portfolio, setPortfolio] = useState<CurrencyEntity[]>([]);
  const [cryptoRates, setCryptoRates] = useState<CurrencyEntity[]>([]);
  const [addCoinsModalVisible, setAddCoinsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchCryptoRates();
  }, []);

  const handleOpenPortfolio = () => {
    setPortfolioVisible(true);
  };

  const handleClosePortfolio = () => {
    setPortfolioVisible(false);
  };

  const handleOpenAddCoinsModal = () => {
    setAddCoinsModalVisible(true);
  };

  const handleCloseAddCoinsModal = () => {
    setAddCoinsModalVisible(false);
  };

  const handleAddCoins = (selectedCoins: CurrencyEntity[]) => {
    const updatedPortfolio = [...portfolio, ...selectedCoins];
    setPortfolio(updatedPortfolio);
  };

  const handleDeleteCoin = (id: string) => {
    const updatedPortfolio = portfolio.filter(coin => coin.id !== id);
    setPortfolio(updatedPortfolio);
  };

  const handlePortfolioUpdate = (updatedPortfolio: CurrencyEntity[]) => {
    setPortfolio(updatedPortfolio);
    // Additional actions if needed
  };

  const fetchCryptoRates = async () => {
    try {
      const response = await httpGet<{ data: CurrencyEntity[] }>('/assets');
      setCryptoRates(response.data.data);
    } catch (error) {
      console.error('Ошибка при получении списка криптовалют:', error);
    }
  };

  return (
    <div className="App">
      <Header />
      <PortfolioButton cryptoRates={cryptoRates} onOpenAddCoinsModal={handleOpenAddCoinsModal} onAddToPortfolio={() => {}} />
      {portfolioVisible && <PortfolioModal onClose={handleClosePortfolio} visible={portfolioVisible} portfolio={portfolio} onDelete={handleDeleteCoin} cryptoRates={cryptoRates} onPortfolioUpdate={handlePortfolioUpdate} />}
      <CoinTable />
      <AddCoinsModal visible={addCoinsModalVisible} onClose={handleCloseAddCoinsModal} coins={cryptoRates} onAddCoins={handleAddCoins} />
    </div>
  );
};

export default App;
