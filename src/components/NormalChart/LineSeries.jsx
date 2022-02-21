import React, { useEffect, useState, useRef, useCallback } from 'react';
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

let lineSeriesChart = null;
let currentData = [];
// const width = Math.min(1300, document.body.offsetWidth);
// var height = Math.round(width * 0.5625);
var toolTipWidth = 125;
let chart = null;
const LineSeries = ({ interval, barSize, width, height, isMobileView }) => {
  const { market } = useMarket();
  const chartRef = useRef(null);
  const tooltipRef = useRef();
  const [state, setState] = useState({ loading: false });

  // // Functions
  const setData = useCallback(() => {
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
          const { t: time = [], c: close = [] } = data || {};
          const seriesData = zipWith(time, close, (time, close) => ({
            time,
            value: parseFloat(close.toFixed(2)),
          }));
          return [...seriesData, ...acc];
        }, []);
        lineSeriesChart.setData(currentData);
        outOfChart(currentData);
        chart.timeScale().fitContent();

        // chart.applyOptions({
        //   timeScale: {
        //     autoScale: true,
        //     barSpacing: barSize,
        //     lockVisibleTimeRangeOnResize: true,
        //     visible: false,
        //     timeVisible: false,
        //   },
        // });
      })
      .finally(() => {
        setState((prev) => ({ ...prev, loading: false }));
      });
    
    // outOfChart(currentData);
    chart.timeScale().fitContent();
  }, [interval, market]);

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

    
    const currentToolTip = tooltipRef.current
    if(!currentToolTip) return ;
    currentToolTip.innerHTML = `<div class="tooltip__price">${priceStr}</div><div class="tooltip__time">${differenceStr} ${dateStr}</div>`;
    currentToolTip.style.top = 14 + 'px';
    currentToolTip.style.left = 12 + 'px';
    currentToolTip.style.display = 'block';
  };

  const subscribeHandler = useCallback((param) => {
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
      var price = param.seriesPrices.get(lineSeriesChart);
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
  }, [height, width]);

  // Life Cycles
  useEffect(() => {
    if (chart) {
      chart.unsubscribeCrosshairMove(subscribeHandler);
      chart.timeScale().fitContent();
    }
    // const dynamicHeight = isMobileView ? 380 : (60 * height) / 100;
    chart = createChart(
      chartRef.current,
      getChartOptions(
        chartRef.current.offsetWidth,
        chartRef.current.offsetHeight,
      ),
    );
    lineSeriesChart = chart.addLineSeries({
      color: Colors.GREEN,
      lineWidth: 2,
      series: {
        priceLineColor: Colors.GREEN,
      },
    });
    chart.subscribeCrosshairMove(subscribeHandler);
    chart.timeScale().fitContent();
    new ResizeObserver((entries) => {
      if (entries.length === 0 || entries[0].target !== chartRef.current) {
        return;
      }
      const newRect = entries[0].contentRect;
      chart.applyOptions({ height: newRect.height, width: newRect.width });
    }).observe(chartRef.current);
  }, [width, height, subscribeHandler]);



  useEffect(() => {
    setData()
    // chart.timeScale().fitContent();
  }, [interval, market, setData]);



  return [
    <div
      key={1}
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
      key={2}
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
