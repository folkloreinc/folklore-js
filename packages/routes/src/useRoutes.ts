import { RoutesMap, useRoutesContext } from './RoutesContext';

const useRoutes = (): RoutesMap => {
    const { routes } = useRoutesContext();
    return routes;
};

export default useRoutes;
