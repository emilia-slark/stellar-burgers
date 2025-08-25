import { Navigate, Outlet } from 'react-router-dom';
import { Preloader } from '@ui';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@hooks';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuth, isLoading } = useAuth();

  if (isLoading) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuth) {
    // если маршрут для авторизованного пользователя, но пользователь неавторизован, то делаем редирект
    return <Navigate replace to='/login' state={{ from: location }} />; // в поле from объекта location.state записываем информацию о URL
  }

  if (onlyUnAuth && isAuth) {
    // если маршрут для неавторизованного пользователя, но пользователь авторизован
    // при обратном редиректе  получаем данные о месте назначения редиректа из объекта location.state
    // в случае если объекта location.state?.from нет — а такое может быть , если мы зашли на страницу логина по прямому URL
    // мы сами создаём объект c указанием адреса и делаем переадресацию на главную страницу
    const from = location.state?.from || { pathname: '/profile' };

    return <Navigate replace to={from} />;
  }

  return <Outlet />;
};
