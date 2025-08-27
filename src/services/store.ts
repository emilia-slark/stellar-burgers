import {
  combineReducers,
  configureStore,
  UnknownAction
} from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import {
  userReducer,
  feedReducer,
  ingredientsReducer,
  burgerReducer
} from '@slices';
import {
  FEED_SLICE_NAME,
  INGREDIENTS_SLICE_NAME,
  USER_SLICE_NAME,
  BURGER_SLICE_NAME
} from '@slices';

const rootReducer = combineReducers({
  [USER_SLICE_NAME]: userReducer,
  [FEED_SLICE_NAME]: feedReducer,
  [INGREDIENTS_SLICE_NAME]: ingredientsReducer,
  [BURGER_SLICE_NAME]: burgerReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

export function checkStatusAsyncAction(
  statusAction: 'pending' | 'fulfilled' | 'rejected',
  sliceName?: keyof RootState,
  thunkName?: string
) {
  return (action: UnknownAction) => {
    if (sliceName && thunkName)
      action.type === `${sliceName}/${thunkName}/${statusAction}`;
    if (sliceName)
      return (
        action.type.startsWith(`${sliceName}/`) &&
        action.type.endsWith(`/${statusAction}`)
      );
    return action.type.endsWith(`/${statusAction}`);
  };
}
