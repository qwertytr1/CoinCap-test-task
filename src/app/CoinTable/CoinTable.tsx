import React, {  lazy, Suspense } from 'react';
import { Spin } from 'antd';
import CoinSearch from '../coinTableElement/coinSearch/CoinSearch';
import CoinTableContent from '../coinTableElement/coinTableContent/CoinTableContent';
import styles from './CoinTable.module.scss';
import { usePortfolio } from 'app/context/PortfolioContext';

const CoinPage = lazy(() => import('../coinPage/CoinPage'));
const PortfolioModal = lazy(() => import('../modals/portfolioModal/PortfolioModal'));
const AddCoinsModal = lazy(() => import('../modals/addCoinsModal/AddCoinsModal'));

const CoinTable: React.FC = () => {
  const {
    loading,
    selectedCoin,
    searchLoading,
    addCoinsModalVisible,
  } = usePortfolio();

  return (
    <div className={styles.mainContainer}>
      {loading ? (
        <Spin />
      ) : (
        <>
          {!selectedCoin && <CoinSearch />}
          {searchLoading && <div>Searching...</div>}
          {selectedCoin ? (
            <Suspense fallback={<Spin />}>
              <CoinPage />
            </Suspense>
          ) : (
            <CoinTableContent />
          )}
          <Suspense fallback={<Spin />}>
            <PortfolioModal />
          </Suspense>
          {addCoinsModalVisible && (
            <Suspense fallback={<Spin />}>
              <AddCoinsModal />
            </Suspense>
          )}
        </>
      )}
    </div>
  );
};

export default CoinTable;
