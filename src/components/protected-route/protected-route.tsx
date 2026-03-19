import { FC, ReactNode } from 'react';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  children: ReactNode;
  noAuthOnly?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  noAuthOnly
}) => {
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const from = location.state?.from || '/';

  return !user.isAuthChecked || user.isAuthLoading ? (
    <Preloader />
  ) : (user.user === null) === (noAuthOnly === true) ? (
    <>{children}</>
  ) : (
    <Navigate
      to={noAuthOnly ? from : '/login'}
      state={{ from: location }}
      replace
    />
  );
};
