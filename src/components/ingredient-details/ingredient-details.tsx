import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from '@store';
import { selectIngredientById } from '@selectors';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const ingredientData = useSelector(selectIngredientById(id!));

  if (!ingredientData || !id) {
    return <Preloader />;
  }

  return (
    <>
      {!location.state && (
        <span className='text text_type_main-large'>Детали ингредиента</span>
      )}
      <IngredientDetailsUI ingredientData={ingredientData} />
    </>
  );
};
