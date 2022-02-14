export const Colors = {
  RED: '#CE5D47',
  GREEN: '#6ACF9E',
  BLACK: '#060B13',
};
export const getChartOptions = (width, height) => ({
  handleScale: {
    mouseWheel: false,
  },
  width: width,
  height: height,
  rightPriceScale: {
    visible: false,
    autoScale: true,
  },
  leftPriceScale: {
    visible: false,
    autoScale: true,
  },
  layout: {
    backgroundColor: Colors.BLACK,
    textColor: Colors.GREEN,
  },
  grid: {
    horzLines: {
      visible: false,
    },
    vertLines: {
      visible: false,
    },
  },
  crosshair: {
    vertLine: {
      visible: true,
    },
    horzLine: {
      visible: false,
      labelVisible: false,
    },
  },
  timeScale: {
    autoScale: true,
    lockVisibleTimeRangeOnResize: false,
    visible: false,
    timeVisible: false,
  },
  handleScroll: {
    vertTouchDrag: false,
    mouseWheel: false,
  },
});
