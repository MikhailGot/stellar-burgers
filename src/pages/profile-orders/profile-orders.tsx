import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { fetchOrders } from '../../services/slices/ordersSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector((store) => store.orders.orders);
  const isLoading = useSelector((store) => store.orders.isLoading);
  const isLoaded = useSelector((store) => store.orders.isLoaded);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoaded && !isLoading) {
      dispatch(fetchOrders());
    }
  });

  return isLoading ? <Preloader /> : <ProfileOrdersUI orders={orders} />;
};
