import { Route, Switch } from 'wouter';

import { MicromagItem } from '../types/micromag';
import MainLayout from './layouts/Main';
import MicromagPage from './pages/Micromag';

interface RoutesProps {
    micromags?: MicromagItem[] | null;
    loading?: boolean;
}

function Routes({ micromags = null, loading = false }: RoutesProps) {
    const [micromag] = micromags || [];
    return (
        <Switch>
            <Route path="/:screen">
                {({ screen = null }: { screen?: string; }) => (
                    <MainLayout>
                        <MicromagPage micromag={micromag} screen={screen} />
                    </MainLayout>
                )}
            </Route>
            <Route>
                <MainLayout>
                    <MicromagPage micromag={micromag} />
                </MainLayout>
            </Route>
        </Switch>
    );
}

export default Routes;
