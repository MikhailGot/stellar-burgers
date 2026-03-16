import { FC, ReactNode } from 'react';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: ReactNode;
};
export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const isAuth = useSelector((state) => state.user.isAuth);
  const isAuthLoading = useSelector((state) => state.user.isAuthLoading);
  return isAuthLoading ? (
    <Preloader />
  ) : isAuth ? (
    <>{children}</>
  ) : (
    <Navigate to='/login' replace />
  );
};
