import Root from './Root';
import store from '../store/Store';

const route =  {
  path: '/',
  component: Root,
  indexRoute: require('../routes/task').default,
  childRoutes: [

  ]
};

export { route, store };
