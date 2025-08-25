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

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../layout/Layout';
import { CenteredContainer } from '../centered-container';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info';
import { IngredientDetails } from '../ingredient-details';
import { ProtectedRoute } from '@components';
import { useEffect, useRef } from 'react';
import { useDispatch } from '@store';
import { fetchIngredients, fetchUser } from '@slices';

const App = () => {
  const initRef = useRef<boolean>(true);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  const onCloseModal = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!initRef.current) return;

    dispatch(fetchIngredients());
    dispatch(fetchUser());

    return () => {
      initRef.current = false;
    };
  }, [initRef]);

  return (
    <div className={styles.app}>
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<Layout />}>
          <Route index element={<ConstructorPage />} />

          <Route path='/feed' element={<Feed />} />
          <Route
            path='/feed/:number'
            element={
              <CenteredContainer>
                <OrderInfo />
              </CenteredContainer>
            }
          />

          <Route
            path='/ingredients/:id'
            element={
              <CenteredContainer>
                <IngredientDetails />
              </CenteredContainer>
            }
          />

          <Route path='/login' element={<ProtectedRoute onlyUnAuth />}>
            <Route index element={<Login />} />
          </Route>

          <Route path='/register' element={<ProtectedRoute onlyUnAuth />}>
            <Route index element={<Register />} />
          </Route>

          <Route
            path='/forgot-password'
            element={<ProtectedRoute onlyUnAuth />}
          >
            <Route path='/forgot-password' element={<ForgotPassword />} />
          </Route>

          <Route path='/reset-password' element={<ProtectedRoute onlyUnAuth />}>
            <Route index element={<ResetPassword />} />
          </Route>

          <Route path='/profile' element={<ProtectedRoute />}>
            <Route index element={<Profile />} />
          </Route>

          <Route path='/profile/orders' element={<ProtectedRoute />}>
            <Route index element={<ProfileOrders />} />
          </Route>

          <Route path='/profile/orders/:number' element={<ProtectedRoute />}>
            <Route
              index
              element={
                <CenteredContainer>
                  <OrderInfo />
                </CenteredContainer>
              }
            />
          </Route>

          <Route
            path='*'
            element={
              <CenteredContainer>
                <NotFound404 />
              </CenteredContainer>
            }
          />
        </Route>
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal onClose={onCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={onCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />

          <Route path='/profile/orders/:number' element={<ProtectedRoute />}>
            <Route
              index
              element={
                <Modal onClose={onCloseModal}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
