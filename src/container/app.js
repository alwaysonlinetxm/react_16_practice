import Root from './Root';
import { createAppStore } from '../store/Store';

const createAppRoutes =  store => ({
  path: '/',
  component: Root,
  indexRoute: require('../routes/home')['default'](store),
  childRoutes: [
    require('../routes/task')['default'](store)
  ]
});

export { createAppRoutes, createAppStore };
