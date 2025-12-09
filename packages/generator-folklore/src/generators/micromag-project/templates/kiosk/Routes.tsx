import { useRoutes } from '@folklore/routes';
import { Route, Switch } from 'wouter';

import { MicromagItem } from '../types/micromag';
import MainLayout from './layouts/Main';
import HomePage from './pages/Home';
import MicromagPage from './pages/Micromag';

interface RoutesProps {
    micromags?: MicromagItem[] | null;
    loading?: boolean;
}

function Routes({ micromags = null, loading = false }: RoutesProps) {
    const routes = useRoutes() || {};

    return (
        <Switch>
            <Route path="/:micromag/:screen?">
                {({
                    micromag: micromagSlug = null,
                    screen = null,
                }: {
                    micromag: string;
                    screen?: string;
                }) => (
                    <MainLayout>
                        <MicromagPage
                            micromag={
                                (micromags || []).find(({ slug }) => slug === micromagSlug) || null
                            }
                            screen={screen}
                            hasHome
                        />
                    </MainLayout>
                )}
            </Route>
            <Route>
                <MainLayout>
                    <HomePage micromags={micromags} />
                </MainLayout>
            </Route>
        </Switch>
    );
}

export default Routes;
