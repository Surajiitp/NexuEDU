import { useCallback, useSyncExternalStore, useMemo } from 'react';

// Event for route changes
const ROUTE_CHANGE_EVENT = 'applet_route_change';

function dispatchRouteChange() {
  window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(ROUTE_CHANGE_EVENT, callback);
  window.addEventListener('popstate', callback);
  return () => {
    window.removeEventListener(ROUTE_CHANGE_EVENT, callback);
    window.removeEventListener('popstate', callback);
  };
}

export function useRouter() {
  const push = useCallback((url: string) => {
    window.history.pushState({}, '', url);
    dispatchRouteChange();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const replace = useCallback((url: string) => {
    window.history.replaceState({}, '', url);
    dispatchRouteChange();
  }, []);

  const back = useCallback(() => {
    window.history.back();
  }, []);

  const forward = useCallback(() => {
    window.history.forward();
  }, []);

  const refresh = useCallback(() => {
    dispatchRouteChange();
  }, []);

  return useMemo(
    () => ({ push, replace, back, forward, refresh }),
    [push, replace, back, forward, refresh]
  );
}

export function usePathname(): string {
  const pathname = useSyncExternalStore(
    subscribe,
    () => window.location.pathname || '/',
    () => '/'
  );
  return pathname;
}

export function useSearchParams(): URLSearchParams {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => ''
  );
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default {
  useRouter,
  usePathname,
  useSearchParams,
};
