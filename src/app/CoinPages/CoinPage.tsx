import React, { useState, useEffect } from 'react';
import { Button, Spin, Typography, Select } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { CurrencyEntity } from '../interfaces';
import { httpGet } from '../api/apiHandler';
import { format, fromUnixTime } from 'date-fns';
import './CoinPage.css';
import AddCoinsModal from '../modul/addCoins'; // Импортируем компонент модального окна для добавления монет

const { Text } = Typography;
const { Option } = Select;

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartDataPoint {
    time: number;
    priceUsd: string;
}

interface ChartApiResponse {
    data: ChartDataPoint[];
}

const CoinPage = ({ coin, onClose, onAddToPortfolio }: { coin: CurrencyEntity; onClose: () => void; onAddToPortfolio: (coin: CurrencyEntity) => void }) => {
    const [chartData, setChartData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRange, setTimeRange] = useState('d1');
    const [addCoinsModalVisible, setAddCoinsModalVisible] = useState(false);

    const fetchChartData = async (range: string) => {
        setLoading(true);
        setError('');
        try {
            const response = await httpGet<ChartApiResponse>(`/assets/${coin.id}/history?interval=${range}`);
            const data = response.data.data;

            let timeFormat:string;
            switch(range) {
                case 'd1':
                    timeFormat = 'dd.MM.yyyy';
                    break;
                case 'h12':
                    timeFormat = 'HH:mm';
                    break;
                case 'h1':
                    timeFormat = 'HH:mm';
                    break;
                default:
                    timeFormat = 'HH:mm';
            }

            const formattedData = {
                labels: data.map(entry => {
                    if (range === 'd1') {
                        const date = fromUnixTime(entry.time / 1000);
                        return format(date, timeFormat);
                    } else {
                        return format(fromUnixTime(entry.time / 1000), timeFormat);
                    }
                }),
                datasets: [
                    {
                        label: `Цена ${coin.name} в USD`,
                        data: data.map(entry => parseFloat(entry.priceUsd)),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        fill: false,
                    },
                ],
            };

            setChartData(formattedData);
            localStorage.setItem(`chartData_${coin.id}_${range}`, JSON.stringify(formattedData));
        } catch (error) {
            setError('Ошибка при загрузке данных графика.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedData = localStorage.getItem(`chartData_${coin.id}_${timeRange}`);
        if (savedData) {
            setChartData(JSON.parse(savedData));
            setLoading(false);
        } else {
            fetchChartData(timeRange);
        }
    }, [coin.id, timeRange]);

    const handleTimeRangeChange = (value: string) => {
        setTimeRange(value);
    };

    const handleAddToPortfolio = (coins: CurrencyEntity[]) => {
        coins.forEach(onAddToPortfolio); // Передаем выбранную монету в родительский компонент
        setAddCoinsModalVisible(false); // Закрываем модальное окно
    };

    return (
        <div className="coin-page">
            <div className="coin-info">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img width={50} src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`} alt="Логотип" />
                    <div>
                        <h1>{coin.name}</h1>
                        <p>Символ: {coin.symbol}</p>
                        <p>Ранг: {coin.rank}</p>
                        <p>Предложение: {coin.supply}</p>
                        <p>Цена в USD: ${coin.priceUsd}</p>
                        <p>Рыночная капитализация в USD: ${coin.marketCapUsd}</p>
                        <p>Максимальное предложение: {coin.maxSupply}</p>
                    </div>
                </div>
                <Select defaultValue="d1" style={{ width: 120 }} onChange={handleTimeRangeChange}>
                    <Option value="d1">1 день</Option>
                    <Option value="h12">12 часов</Option>
                    <Option value="h1">1 час</Option>
                </Select>
                <Button onClick={onClose}>Назад</Button>
                <Button type="primary" onClick={() => setAddCoinsModalVisible(true)}>Добавить</Button>
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
                                    text: timeRange === 'd1' ? 'Дата' : 'Время'
                                }
                            },
                            y: {
                                display: true,
                                title: {
                                    display: true,
                                    text: 'Цена в USD'
                                }
                            }
                        }
                    }} />
                ) : null}
            </div>
            <AddCoinsModal
                open={addCoinsModalVisible}
                onClose={() => setAddCoinsModalVisible(false)}
                coins={[coin]} // Передаем выбранную монету в модальное окно для добавления
                onAddCoins={handleAddToPortfolio} // Обработчик добавления монеты в портфель
            />
        </div>
    );
};

export default CoinPage;