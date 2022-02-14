import React, { useEffect, useState, useRef } from 'react';
import { createChart, isBusinessDay } from 'lightweight-charts';
import { Colors, getChartOptions } from './chartOptions';
import { Spin } from 'antd';
import axios from 'axios';
import {
  getTimeData,
  formatPrice,
  formatDifference,
  businessDayToString,
} from './chartUtil';
import { useMarket, USE_MARKETS } from '../../utils/markets';
import { zipWith } from 'lodash';

let candleSeriesChart = null;
let currentData = [];
// const width = Math.min(1100, document.body.offsetWidth);
// var height = Math.round(width * 0.5625);
var toolTipWidth = 125;
let chart = null;
const LineSeries = ({ interval, barSize, width, height, isMobileView }) => {
  const { market } = useMarket();
  const chartRef = useRef(null);
  const tooltipRef = useRef();
  const [state, setState] = useState({ loading: false });
  // // Functions
  const setData = () => {
    setState((prev) => ({ ...prev, loading: true }));
    const timeIntervals = getTimeData(interval) || [];
    const axiosRequests = [];
    timeIntervals.forEach((intervalObj) => {
      const { currentTime, endTime } = intervalObj;
      const symbol =
        USE_MARKETS.find(
          (m) => m.address.toBase58() === market?.publicKey.toBase58(),
        )?.name || 'SRM/USDC';
      const params = {
        symbol,
        resolution: 60,
        from: currentTime,
        to: endTime,
      };
      axiosRequests.push(
        axios.get(`https://dry-ravine-67635.herokuapp.com/tv/history`, {
          params,
        }),
      );
    });
    currentData = [];
    axios
      .all(axiosRequests)
      .then((response) => {
        currentData = [];
        currentData = response.reduce((acc, obj) => {
          const { data } = obj || {};
          const {
            t: time = [],
            c: close = [],
            l: low = [],
            o: open = [],
            h: high = [],
          } = data || {};
          const seriesData = zipWith(
            time,
            close,
            low,
            open,
            high,
            (time, close, low, open, high) => ({
              time: time || 10,
              close: close || 10,
              low: low || 10,
              open: open || 10,
              high: high || 10,
            }),
          );
          return [...seriesData, ...acc];
        }, []);
        candleSeriesChart.setData(currentData);
        chart.timeScale().fitContent();
        // chart.applyOptions({
        //   autoScale: true,
        //   barSpacing: barSize,
        //   lockVisibleTimeRangeOnResize: true,
        //   visible: false,
        //   timeVisible: false,
        // });
      })
      .finally(() => {
        setState((prev) => ({ ...prev, loading: false }));
      });
    chart.timeScale().fitContent();

    outOfChart(currentData);
  };
  const outOfChart = (currentData) => {
    if (
      !currentData ||
      !currentData[currentData.length - 1] ||
      !currentData[currentData.length - 1]
    ) {
      return;
    }
    var previousPriceObj = currentData[currentData.length - 2];
    var currentPriceObj = currentData[currentData.length - 1];
    var previousPrice;
    var price;
    var pointDate = currentData[currentData.length - 1].time;
    var dateStr;
    if (typeof pointDate === 'object') {
      dateStr = `${pointDate.month}/${pointDate.day}/${pointDate.year}`;
    }

    if (typeof pointDate === 'number') {
      dateStr = new Date(
        currentData[currentData.length - 1].time * 1000,
      ).toLocaleDateString();
    }

    if ('value' in previousPriceObj) {
      price = currentPriceObj.value;
      if (typeof previousPriceObj !== 'undefined') {
        previousPrice = previousPriceObj.value;
      }
    } else {
      price = currentPriceObj.close;
      if (typeof previousPriceObj !== 'undefined') {
        previousPrice = previousPriceObj.close;
      }
    }
    var differenceStr = '';

    if (typeof previousPriceObj !== 'undefined') {
      differenceStr = formatDifference(price, previousPrice);
    }

    var priceStr = formatPrice(price);

    tooltipRef.current.innerHTML = `<div class="tooltip__price">${priceStr}</div><div class="tooltip__time">${differenceStr} ${dateStr}</div>`;
    tooltipRef.current.style.top = 14 + 'px';
    tooltipRef.current.style.left = 12 + 'px';
    tooltipRef.current.style.display = 'block';
  };
  const subscribeHandler = (param) => {
    if (
      !param.time ||
      param.point.x < 0 ||
      param.point.x > width ||
      param.point.y < 0 ||
      param.point.y > height
    ) {
      outOfChart(currentData);
    } else {
      var previousPriceObj;
      var price = param.seriesPrices.get(candleSeriesChart);
      var previousPrice;
      var dateStr;
      if (typeof param.time === 'object') {
        dateStr = `${param.time.month}/${param.time.day}/${param.time.year}`;
      } else {
        dateStr = isBusinessDay(param.time)
          ? businessDayToString(param.time)
          : new Date(param.time * 1000).toLocaleDateString();
      }

      previousPriceObj =
        currentData[
          currentData.indexOf(
            currentData.find((currentData) => currentData.time === param.time),
          ) - 1
        ];
      if (typeof price !== 'object') {
        if (typeof previousPriceObj !== 'undefined') {
          previousPrice = previousPriceObj.value;
        }
      } else {
        price = price.close;
        if (typeof previousPriceObj !== 'undefined') {
          previousPrice = previousPriceObj.close;
        }
      }

      var differenceStr = '';

      if (typeof previousPriceObj !== 'undefined') {
        differenceStr = formatDifference(price, previousPrice);
      }

      var priceStr = formatPrice(price);

      tooltipRef.current.innerHTML = `<div class="tooltip__price">${priceStr}</div><div class="tooltip__time">${differenceStr} ${dateStr}</div>`;
      var left = param.point.x - toolTipWidth / 2;
      left = Math.max(0, Math.min(width - toolTipWidth, left));
      tooltipRef.current.style.left = left + 'px';
      tooltipRef.current.style.top = 14 + 'px';
      tooltipRef.current.style.display = 'block';
    }
  };
  // Life Cycles
  useEffect(() => {
    if (chart) {
      chart.unsubscribeCrosshairMove(subscribeHandler);
    }
    // const dynamicHeight = isMobileView ? 380 : (60 * height) / 100;
    chart = createChart(
      chartRef.current,
      getChartOptions(
        chartRef.current.offsetWidth,
        chartRef.current.offsetHeight,
      ),
    );
    candleSeriesChart = chart.addCandlestickSeries({
      upColor: Colors.GREEN,
      downColor: Colors.RED,
      borderUpColor: Colors.GREEN,
      borderDownColor: Colors.RED,
      wickUpColor: Colors.GREEN,
      wickDownColor: Colors.RED,
    });
    chart.timeScale().fitContent();
    chart.subscribeCrosshairMove(subscribeHandler);
    new ResizeObserver((entries) => {
      if (entries.length === 0 || entries[0].target !== chartRef.current) {
        return;
      }
      const newRect = entries[0].contentRect;
      chart.applyOptions({ height: newRect.height, width: newRect.width });
    }).observe(chartRef.current);
  }, [width, height]);
  useEffect(() => {
    setData();
  }, [interval, market]);
  return [
    <div
      style={{
        height: '50vh',
        display: state.loading ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin size="large" />
    </div>,
    <div
      id="chart-container"
      style={{
        height: '50vh',
        width: '100%',
        display: state.loading && 'none',
      }}
      ref={chartRef}
    >
      <div className="tooltip" ref={tooltipRef}></div>
    </div>,
  ];
};

export default LineSeries;
