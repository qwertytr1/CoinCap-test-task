import React, { useState, useEffect } from 'react';
import { Button, Spin, Typography } from 'antd';
import { Line } from 'react-chartjs-2';
import { CurrencyEntity } from '../interfaces';
import { httpGet } from '../api/apiHandler';

const { Text } = Typography;

const CoinPage = ({ coin, onClose }: { coin: CurrencyEntity; onClose: () => void }) => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchChartData = async () => {
            setLoading(true);
            try {

                setLoading(false);
            } catch (error) {
                setError('Ошибка при загрузке данных графика.');
                setLoading(false);
            }
        };

        fetchChartData();
    }, [coin.id]);

    return (
        <div>
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
            {loading ? (
                <Spin />
            ) : error ? (
                <Text type="danger">{error}</Text>
            ) : chartData ? (
                <Line data={chartData} />
            ) : null}
            <Button onClick={onClose}>Назад</Button>
            <Button type="primary">Добавить в портфель</Button>
        </div>
    );
};

export default CoinPage;
