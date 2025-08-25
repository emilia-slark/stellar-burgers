import { useSelector } from '@store';
import {
  selectIsAuthenticated,
  selectUser,
  selectisLoadingUser
} from '@selectors';

export function useAuth() {
  const { name, email } = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectisLoadingUser);

  return {
    isAuth: isAuthenticated && (!!name || !!email),
    isLoading
  };
}
