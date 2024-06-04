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
  const [selectedCoinsToAdd, setSelectedCoinsToAdd] = useState<CurrencyEntity[]>([]);

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
    const selectedCoins = cryptoRates.filter(coin => !portfolio.some(portfolioCoin => portfolioCoin.id === coin.id));
    setSelectedCoinsToAdd(selectedCoins);
    setAddCoinsModalVisible(true);
  };

  const handleCloseAddCoinsModal = () => {
    setAddCoinsModalVisible(false);
  };

  const handleAddCoins = async (selectedCoins: CurrencyEntity[]) => {
    const updatedPortfolio = [...portfolio, ...selectedCoins];
    setPortfolio(updatedPortfolio);
    setPortfolioVisible(true);
    setAddCoinsModalVisible(false);
  };

  const handleDeleteCoin = (id: string) => {
    const updatedPortfolio = portfolio.filter(coin => coin.id !== id);
    setPortfolio(updatedPortfolio);
  };

  const fetchCryptoRates = async () => {
    try {
      const response = await httpGet<{ data: CurrencyEntity[] }>('/assets');
      setCryptoRates(response.data.data);
    } catch (error) {
      console.error('Ошибка при получении списка криптовалют:', error);
    }
  };

  const handleAddToPortfolio = (coin: CurrencyEntity) => {
    // Проверяем, если монета уже есть в портфеле, то не добавляем
    if (!portfolio.some(portfolioCoin => portfolioCoin.id === coin.id)) {
      const updatedPortfolio = [...portfolio, coin];
      setPortfolio(updatedPortfolio);
    }
  };

  return (
    <div className="App">
      <Header />
      <PortfolioButton
        cryptoRates={cryptoRates}
        onOpenAddCoinsModal={handleOpenAddCoinsModal}
        onAddToPortfolio={handleAddToPortfolio}
        onOpenPortfolio={handleOpenPortfolio}
      />
      <PortfolioModal
        visible={portfolioVisible}
        onClose={handleClosePortfolio}
        portfolio={portfolio}
        onDelete={handleDeleteCoin}
      />
      <CoinTable
        portfolio={portfolio}
        onAddToPortfolio={handleAddToPortfolio}
        onDeleteCoin={handleDeleteCoin} // Передаем функцию удаления
      />
      <AddCoinsModal
        open={addCoinsModalVisible}
        onClose={handleCloseAddCoinsModal}
        coins={selectedCoinsToAdd}
        onAddCoins={handleAddCoins}
      />
    </div>
  );
};

export default App;
