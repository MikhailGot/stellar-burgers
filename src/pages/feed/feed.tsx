import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedsSlice';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector((store) => store.feed.orders);
  const isLoading = useSelector((store) => store.feed.isLoading);
  const isLoaded = useSelector((store) => store.feed.isLoaded);
  const dispatch = useDispatch();

  const feed = {};

  const updateOrders = () => {
    dispatch(fetchFeeds());
  };

  useEffect(() => {
    if (!isLoaded && !isLoading) {
      updateOrders();
    }
  }, [isLoaded, isLoading]);

  return isLoading ? (
    <Preloader />
  ) : (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        updateOrders();
      }}
    />
  );
};
