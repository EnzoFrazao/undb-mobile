import { useLayoutEffect } from 'react';

export function useExitGuard(message, blocking, onDirtyChange, onBlockingChange) {
  useLayoutEffect(() => {
    onDirtyChange?.(message);
    onBlockingChange?.(blocking);
    return () => {
      onDirtyChange?.('');
      onBlockingChange?.(false);
    };
  }, [message, blocking, onDirtyChange, onBlockingChange]);
}
