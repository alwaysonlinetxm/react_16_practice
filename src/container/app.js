import Root from './Root';
import { createAppStore } from '../store/Store';

// exported as a function for accepting a initial store when server rendering
const createAppRoutes =  store => ({
  path: '/',
  component: Root,
  indexRoute: require('../routes/home')['default'](store),
  childRoutes: [
    require('../routes/task')['default'](store)
  ]
});

export { createAppRoutes, createAppStore };
