import { FC, ReactNode } from 'react';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: ReactNode;
  noAuthOnly?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  noAuthOnly
}) => {
  const user = useSelector((state) => state.user);
  return !user.isInitialized || user.isAuthLoading ? (
    <Preloader />
  ) : user.isAuth !== (noAuthOnly === true) ? (
    <>{children}</>
  ) : (
    <Navigate to={noAuthOnly ? '/' : '/login'} replace />
  );
};
