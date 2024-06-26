import CoinTable from '../coinTable/CoinTable';
import CoinPage from '../coinPage/CoinPage';  // New import
import ErrorPage from '../errorPage/ErrorPage';

const routes = [
  {
    name: 'Home',
    path: '/',
    component: CoinTable,
  },
  {
    name: 'Coin Details',
    path: '/coin/:rank',
    component: CoinPage,
  },
  {
    name: 'Error',
    path: '/error',
    component: ErrorPage,
  },
];

export default routes;
