import { FC, useEffect, useMemo, useRef } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '@store';
import { selectFeedOrderByNumber, selectIngredients } from '@selectors';
import { useLocation, useParams } from 'react-router-dom';
import { fetchFeed } from '@slices';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const initRef = useRef<boolean>(true);

  const ingredients = useSelector(selectIngredients);
  const orderData = useSelector(selectFeedOrderByNumber(parseInt(number!)));

  useEffect(() => {
    if (!initRef.current) return;

    if (!orderData) dispatch(fetchFeed());

    return () => {
      initRef.current = false;
    };
  }, [orderData]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return (
    <>
      {!location.state && (
        <span className='text text_type_main-large'>{`#${orderInfo.number}`}</span>
      )}
      <OrderInfoUI orderInfo={orderInfo} />
    </>
  );
};
