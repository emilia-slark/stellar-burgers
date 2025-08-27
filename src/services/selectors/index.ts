import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  FEED_SLICE_NAME,
  INGREDIENTS_SLICE_NAME,
  USER_SLICE_NAME,
  BURGER_SLICE_NAME
} from '@slices';

//--------------Для feed--------------

export const selectFeedOrdersState = (state: RootState) =>
  state[FEED_SLICE_NAME];

export const selectFeed = (state: RootState) => state[FEED_SLICE_NAME].feed;

export const selectFeedOrderByNumber = (number?: number) =>
  createSelector(selectFeed, (allFeedOrders) =>
    allFeedOrders?.orders.find((item) => item.number === number)
  );

//--------------Для ingredients--------------

export const selectIngredients = (state: RootState) =>
  state[INGREDIENTS_SLICE_NAME].list;

export const selectIsLoadingIngredients = (state: RootState) =>
  state[INGREDIENTS_SLICE_NAME].isLoading;

export const selectIngredientsByType = (type: string) =>
  createSelector(selectIngredients, (allIngredients) =>
    allIngredients.filter((item) => item.type === type)
  );

export const selectIngredientById = (id: string) =>
  createSelector(selectIngredients, (allIngredients) =>
    allIngredients.find((item) => item._id === id)
  );

//--------------Для burger--------------

export const selectBurgerItems = (state: RootState) => state[BURGER_SLICE_NAME];

export const selectIsOrdering = (state: RootState) =>
  state[BURGER_SLICE_NAME].isOrdering;

export const selectOrderData = (state: RootState) =>
  state[BURGER_SLICE_NAME].lastOrder;

//--------------Для user--------------

export const selectUser = (state: RootState) => state[USER_SLICE_NAME].user;

export const selectIsAuthenticated = (state: RootState) =>
  state[USER_SLICE_NAME].isAuthenticated;

export const selectErrorAuth = (state: RootState) =>
  state[USER_SLICE_NAME].errorAuth;

export const selectErrorRegister = (state: RootState) =>
  state[USER_SLICE_NAME].errorRegister;

export const selectisLoadingUser = (state: RootState) =>
  state[USER_SLICE_NAME].isLoading;

export const selectisLoadingOrders = (state: RootState) =>
  state[USER_SLICE_NAME].isLoadingOrders;

export const selectUserOrders = (state: RootState) =>
  state[USER_SLICE_NAME].orders;
