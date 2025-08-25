import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from '@store';
import { ProfileOrdersUI } from '@ui-pages';
import { selectUserOrders } from '@selectors';
import { fetchOrders } from '@slices';

export const ProfileOrders: FC = () => {
  const initRef = useRef<boolean>(true);
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    if (!initRef.current) return;

    dispatch(fetchOrders());

    return () => {
      initRef.current = false;
    };
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
