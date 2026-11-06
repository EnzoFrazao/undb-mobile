import { Platform } from 'react-native';

export function focusFirstError(errors, order, refs, scrollRef) {
  const field = order.find((name) => errors[name]);
  if (!field) return;
  requestAnimationFrame(() => {
    const input = refs[field]?.current;
    if (!input) return;
    if (Platform.OS === 'web') input.scrollIntoView?.({ block: 'nearest' });
    else if (scrollRef?.current) {
      const scroll = scrollRef.current;
      const content = scroll.getInnerViewRef?.();
      const reset = () => scroll.scrollTo({ y: 0, animated: false });
      if (content) input.measureLayout(content, (_x, y) => scroll.scrollTo({ y: Math.max(0, y - 16), animated: false }), reset);
      else reset();
    }
    input.focus?.();
  });
}
