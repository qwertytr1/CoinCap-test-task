
import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './ErrorPage.module.scss';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.errorMessage}>Монета не найдена</h1>
      <p className={styles.errorArticle}>К сожалению, монета с таким идентификатором не найдена.</p>
      <Button type="primary" onClick={handleGoBack}>
        Назад
      </Button>
    </div>
  );
};

export default ErrorPage;
