import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  selectBurgerItems,
  selectIsOrdering,
  selectOrderData
} from '@selectors';
import { useDispatch, useSelector } from '@store';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks';
import { clearOrderData, orderBurger } from '@slices';

export const BurgerConstructor: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isAuth } = useAuth();

  const orderRequest = useSelector(selectIsOrdering);
  const constructorItems = useSelector(selectBurgerItems);
  const orderModalData = useSelector(selectOrderData);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuth) navigate('/login', { state: { from: location } });
    else {
      const listIdsBurgerItems = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((ingredient) => ingredient._id),
        constructorItems.bun._id
      ];
      dispatch(orderBurger(listIdsBurgerItems));
    }
  };

  const closeOrderModal = () => {
    if (orderRequest) return;
    dispatch(clearOrderData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
