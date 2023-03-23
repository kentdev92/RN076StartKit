export const handleScrollToEnd = scrollViewRef => {
  scrollViewRef.current.scrollToEnd({animated: true});
};

export const handleScrollToTop = scrollViewRef => {
  scrollViewRef.current?.scrollTo({
    y: 0,
    animated: true,
  });
};

export const handleScrollToNextIndex = (ref, index) => {
  ref.current.scrollToIndex({animated: true, index});
};

export const handleScrollPosition = event => {
  event.nativeEvent.contentOffset.y;
};
