import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '@store';
import { selectUser } from '@selectors';

export const AppHeader: FC = () => {
  const { name } = useSelector(selectUser);

  return <AppHeaderUI userName={name} />;
};
