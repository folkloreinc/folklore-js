import { Route, Switch } from 'wouter';
import { useRoutes } from '@folklore/routes';

import MainLayout from './layouts/Main';
import ErrorPage from './pages/Error';
import HomePage from './pages/Home';

import '<%= getRelativeStylesPath('components/App.jsx', 'styles.css') %>';

function Routes() {
    const routes = useRoutes() || {};
    return (
        <Switch>
            <Route path={routes.home || '/'}>
                <MainLayout>
                    <HomePage />
                </MainLayout>
            </Route>
            <Route>
                <MainLayout>
                    <ErrorPage />
                </MainLayout>
            </Route>
        </Switch>
    );
}

export default Routes;
