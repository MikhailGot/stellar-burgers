import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { getUser } from '../../services/slices/userSlice';
import { fetchFeeds } from '../../services/slices/feedsSlice';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const ingredients = useSelector((state) => state.ingredients);
  const feed = useSelector((state) => state.feed);
  const background = location.state?.background;

  useEffect(() => {
    if (!ingredients.isLoading && !ingredients.isLoaded) {
      dispatch(fetchIngredients());
    }
  }, [ingredients.isLoading, ingredients.isLoaded]);

  useEffect(() => {
    if (!feed.isLoading && !feed.isLoaded) {
      dispatch(fetchFeeds());
    }
  }, [feed.isLoading, feed.isLoaded]);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const modalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      {background && (
        <>
          <Routes>
            <Route
              path='/feed/:number'
              element={
                <Modal title='Заказ' onClose={modalClose}>
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <Modal title='Заказ' onClose={modalClose}>
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            />
            <Route
              path='/ingredients/:id'
              element={
                <Modal title='Ингредиент' onClose={modalClose}>
                  <IngredientDetails />
                </Modal>
              }
            />
          </Routes>
        </>
      )}
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute noAuthOnly>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/register'
          element={
            <ProtectedRoute noAuthOnly>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute noAuthOnly>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute noAuthOnly>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};
export default App;
