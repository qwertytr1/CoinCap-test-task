
import CoinTable from '../CoinTable';
import ErrorPage from '../ErrorPage/ErrorPage';


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
