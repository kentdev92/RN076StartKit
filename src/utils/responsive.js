import {Dimensions, Platform, StatusBar} from 'react-native';

export const {width, height} = Dimensions.get('screen');

//iPhone 12
const DESIGN_WIDTH = 390;
const DESIGN_HEIGHT = 844;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const WIDTH = width > height ? height : width;
const HEIGHT = width > height ? width : height;

const scale = size => {
  return (WIDTH / DESIGN_WIDTH) * size;
};

const verticalScale = size => {
  return (HEIGHT / DESIGN_HEIGHT) * size;
};

const moderateScale = (size, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

/**
 * getSize.m(10) Responsive for padding - margin - fontSize.
 *
 * getSize.s(10) Responsive by width screen. (Image Size)
 *
 * getSize.v(10) Responsive by height screen.
 **/

export const getSize = {
  m: moderateScale,
  s: scale,
  v: verticalScale,
};

export const isIPhoneX = () =>
  Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
    ? (width === DESIGN_WIDTH && height === DESIGN_HEIGHT) ||
      (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
    : false;

export const StatusBarHeight = Platform.select({
  ios: isIPhoneX() ? 44 : 20,
  android: StatusBar.currentHeight,
  default: 0,
});
