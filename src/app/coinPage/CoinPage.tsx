import React, { useState, useEffect } from 'react';
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
const { Text } = Typography;
const { Option } = Select;

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface InitialChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        fill: boolean;
    }[];
}

const CoinPage: React.FC = () => {
    const [chartData, setChartData] = useState<InitialChartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRange, setTimeRange] = useState('d1');
    const { id } = useParams<{ id: string }>();
    const { rank } = useParams<{ rank: string }>();
    const {
        coins,
        handleCloseCoinInfo,
        selectedCoin,
        handleSelectCoin,
        handleOpenAddCoinsModal
    } = usePortfolio();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            handleSelectCoin(id);
        }
    }, [id, handleSelectCoin]);
    useEffect(() => {
        if (coins.length > 0) {
            const selected = coins.find((coin: CurrencyEntity) => coin.rank === rank);
            handleSelectCoin(selected ? selected.id : '');
            if (!selected && rank) {
                navigate('/error');
            }
        }
    }, [rank, coins, handleSelectCoin, navigate]);


    useEffect(() => {
        const fetchChartData = async (range: string) => {
            setLoading(true);
            setError('');
            try {
                if (selectedCoin) {
                    const response = await httpGet<ChartApiResponse>(`/assets/${selectedCoin.id}/history?interval=${range}`);
                    const data = response.data.data;

                    const formattedData: InitialChartData = {
                        labels: data.map(entry => format(fromUnixTime(entry.time / 1000), 'dd.MM.yyyy')),
                        datasets: [
                            {
                                label: `Цена ${selectedCoin.name} в USD`,
                                data: data.map(entry => parseFloat(entry.priceUsd)),
                                borderColor: 'rgba(75, 192, 192, 1)',
                                fill: false,
                            },
                        ],
                    };

                    setChartData(formattedData);
                    localStorage.setItem(`chartData_${selectedCoin.id}_${range}`, JSON.stringify(formattedData));
                }
            } catch (error) {
                setError('Ошибка при загрузке данных графика.');
            } finally {
                setLoading(false);
            }
        };

        if (selectedCoin) {
            const savedData = localStorage.getItem(`chartData_${selectedCoin.id}_${timeRange}`);
            if (savedData) {
                setChartData(JSON.parse(savedData));
                setLoading(false);
            } else {
                fetchChartData(timeRange);
            }
        }
    }, [timeRange, selectedCoin]);

    const handleTimeRangeChange = (value: string) => {
        setTimeRange(value);
    };

    const handleToClose = () => {
        handleCloseCoinInfo();
        navigate(`/`);
    };

    useEffect(() => {
        if (id && !selectedCoin) {
            navigate('/error');
        }
    }, [id, selectedCoin, navigate]);

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
                ) : error ? (
                    <Text type="danger">{error}</Text>
                ) : chartData ? (
                    <Line data={chartData} options={{
                        scales: {
                            x: {
                                display: true,
                                title: {
                                    display: true,
                                    text: 'Дата',
                                },
                            },
                            y: {
                                display: true,
                                title: {
                                    display: true,
                                    text: 'Цена в USD',
                                },
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
