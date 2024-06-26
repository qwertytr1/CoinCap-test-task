
import CoinTable from '../coinTable/CoinTable';
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
    component: CoinTable,
  },
  {
    name: 'Error',
    path: '/error',
    component: ErrorPage,
  },
];

export default routes;
