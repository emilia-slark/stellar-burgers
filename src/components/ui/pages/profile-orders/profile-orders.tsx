import { FC } from 'react';
import styles from './profile-orders.module.css';
import { ProfileOrdersUIProps } from './type';
import { ProfileMenu, OrdersList } from '@components';
import { useSelector } from '@store';
import { selectisLoadingOrders } from '@selectors';
import { Preloader } from '../../preloader';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({ orders }) => {
  const isLoadingOrders = useSelector(selectisLoadingOrders);

  return (
    <main className={`${styles.main}`}>
      <div className={`mt-30 mr-15 ${styles.menu}`}>
        <ProfileMenu />
      </div>
      <div className={`mt-10 ${styles.orders}`}>
        {isLoadingOrders ? (
          <Preloader />
        ) : !orders.length ? (
          <p className='pt-20 text text_type_main-medium'>Тут пока пусто...</p>
        ) : (
          <OrdersList orders={orders} />
        )}
      </div>
    </main>
  );
};
