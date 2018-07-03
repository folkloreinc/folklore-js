import { routerReducer } from 'react-router-redux';
import SiteReducer from './SiteReducer';
import LayoutReducer from './LayoutReducer';

export default {
    site: SiteReducer,
    layout: LayoutReducer,
    router: routerReducer,
};
