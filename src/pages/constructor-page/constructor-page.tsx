import { useDispatch, useSelector } from '@store';
import styles from './constructor-page.module.css';
import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useEffect, useRef } from 'react';
import { selectIsLoadingIngredients } from '@selectors';

export const ConstructorPage: FC = () => {
  const initRef = useRef<boolean>(true);

  const isIngredientsLoading = useSelector(selectIsLoadingIngredients);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!initRef.current) return;

    return () => {
      initRef.current = false;
    };
  }, [dispatch]);

  if (isIngredientsLoading) return <Preloader />;

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
