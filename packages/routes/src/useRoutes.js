import { useRoutesContext } from './RoutesContext';

const useRoutes = () => {
    const { routes } = useRoutesContext();
    return routes;
};

export default useRoutes;
