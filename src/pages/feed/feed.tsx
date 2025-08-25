import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect, useRef, useCallback } from 'react';
import { fetchFeed } from '../../services/slices/feedSlice';
import { useSelector, useDispatch } from '@store';
import { selectFeedOrdersState } from '@selectors';

export const Feed: FC = () => {
  const initRef = useRef<boolean>(true);
  const dispatch = useDispatch();

  const { feed, isLoading } = useSelector(selectFeedOrdersState);
  const handleGetFeeds = useCallback(() => dispatch(fetchFeed()), [dispatch]);

  useEffect(() => {
    if (!initRef.current) return;
    if (!feed?.orders.length) handleGetFeeds();

    return () => {
      initRef.current = false;
    };
  }, [handleGetFeeds]);

  if (!feed?.orders.length || isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={feed.orders} handleGetFeeds={handleGetFeeds} />;
};
