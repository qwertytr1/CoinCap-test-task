import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button, Spin, Typography, Select } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ChartApiResponse, CurrencyEntity } from '../interfaces';
import { httpGet } from '../api/apiHandler';
import { format, fromUnixTime } from 'date-fns';
import './CoinPage.scss';
import AddCoinsModal from '../modals/addCoinsModal/AddCoinsModal';
import { useNavigate, useParams } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { toast } from 'react-toastify';

const { Text } = Typography;
const { Option } = Select;

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



const CoinPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('d1');
  const { id } = useParams<{ id: string }>();
  const { rank } = useParams<{ rank: string }>();
  const {
    currentCoins,
    handleCloseCoinInfo,
    selectedCoin,
    handleSelectCoin,
    handleOpenAddCoinsModal,
    setIsCoinPage,
    loading,
  } = usePortfolio();
  const navigate = useNavigate();

  useEffect(() => {
    setIsCoinPage(true);
    return () => {
      setIsCoinPage(false);
    };
  }, [setIsCoinPage]);

  useEffect(() => {
    if (id) {
      handleSelectCoin(id);
    }
  }, [id, handleSelectCoin]);

  useEffect(() => {
    if (currentCoins.length > 0) {
      const selected = currentCoins.find((coin: CurrencyEntity) => coin.rank === rank);
      if (selected) {
        handleSelectCoin(selected.id);
      } else if (rank) {
        navigate('/error');
      }
    }
  }, [rank, currentCoins, handleSelectCoin, navigate]);

  const fetchChartData = useCallback(async (coinId: string, range: string) => {

    try {
      const response = await httpGet<ChartApiResponse>(`/assets/${coinId}/history?interval=${range}`);
      const data = response.data.data;

      return {
        labels: data.map(entry => format(fromUnixTime(entry.time / 1000), 'dd.MM.yyyy')),
        datasets: [
          {
            label: `Цена ${selectedCoin?.name} в USD`,
            data: data.map(entry => parseFloat(entry.priceUsd)),
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
          },
        ],
      };
    } catch (error) {
      toast.error('Ошибка при загрузке данных графика.');
      return null;
    }
  }, [selectedCoin]);

  const chartData = useMemo(() => {
    if (selectedCoin) {
      const savedData = localStorage.getItem(`chartData_${selectedCoin.id}_${timeRange}`);
      if (savedData) {
        return JSON.parse(savedData);
      } else {
        fetchChartData(selectedCoin.id, timeRange).then(data => {
          if (data) {
            localStorage.setItem(`chartData_${selectedCoin.id}_${timeRange}`, JSON.stringify(data));
            return data;
          }
        });
      }
    }
    return null;
  }, [timeRange, selectedCoin, fetchChartData]);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  const handleToClose = () => {
    handleCloseCoinInfo();
    navigate(`/`);
  };

  if (!selectedCoin) {
    return null;
  }

  return (
    <div className="coin-page">
      <div className="coin-info">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <img width={50} src={`https://assets.coincap.io/assets/icons/${selectedCoin.symbol.toLowerCase()}@2x.png`} alt="Логотип" />
          <div>
            <h1>{selectedCoin.name}</h1>
            <p>Символ: {selectedCoin.symbol}</p>
            <p>Ранг: {selectedCoin.rank}</p>
            <p>Предложение: {selectedCoin.supply}</p>
            <p>Цена в USD: ${selectedCoin.priceUsd}</p>
            <p>Рыночная капитализация в USD: ${selectedCoin.marketCapUsd}</p>
            <p>Максимальное предложение: {selectedCoin.maxSupply}</p>
          </div>
        </div>
        <Select defaultValue="d1" style={{ width: 120 }} onChange={handleTimeRangeChange}>
          <Option value="d1">1 день</Option>
          <Option value="h12">12 часов</Option>
          <Option value="h1">1 час</Option>
        </Select>
        <Button onClick={handleToClose} style={{ marginTop: '10px' }}>Назад</Button>
        <Button type="primary" onClick={() => handleOpenAddCoinsModal(selectedCoin)} style={{ marginTop: '10px' }}>Добавить</Button>
      </div>
      <div className="coin-chart">
        {loading ? (
          <Spin />
        ) : chartData ? (
          <Line data={chartData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Исторические данные цены',
              },
            },
          }} />
        ) : null}
      </div>
      <AddCoinsModal />
    </div>
  );
};

export default CoinPage;
