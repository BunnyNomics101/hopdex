import React, { useState, useEffect } from 'react';
import LineSvg from './line.svg';
import CandleSvg from './candles.svg';
import OrderBookSvg from './order-book.svg';
import { ChartProvider } from '../../contexts/chartContext';

import CandleSeries from './CandleSeries';
import LineSeries from './LineSeries';
import Orderbook from '../Orderbook';
import { Row, Col } from 'antd';
import './normalChart.css';

const intervals = ['1d', '1w', '1m', '3m', '1y'];
const charts = {
  candleChart: 'Candle Chart',
  lineChart: 'Line Chart',
  orderBook: 'Order Boot',
};
const NormalChart = ({
  width,
  height,
  isMobileView,
  smallScreen,
  onPrice,
  onSize,
  depth = 7,
  isTabletView = false,
}) => {
  const [currentInteraval, setCurrentInterval] = useState('1d');
  const [currentChart, setCurrentChart] = useState(charts.lineChart);
  const [barSize, setBarSize] = useState(10);
  const onChartsChangeHandler = () => {
    const toggledChart =
      currentChart === charts.candleChart
        ? charts.lineChart
        : currentChart === charts.lineChart
        ? charts.candleChart
        : charts.lineChart;
    setCurrentChart(toggledChart);
  };
  const onIntervalChangeHandler = (interaval) => {
    const barSize =
      interaval === '1d'
        ? 10
        : interaval === '1w'
        ? 5
        : interaval === '1m'
        ? 4
        : interaval === '3m'
        ? 2
        : 1;
    setCurrentInterval(interaval);
    setBarSize(barSize);
  };

  useEffect(() => {
    let timeOut;
    const windowSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const resize = () => {
      if (
        window.innerWidth === windowSize.width &&
        (isMobileView || isTabletView)
      ) {
        //not triggering rerenderer
        return;
      }

      setCurrentChart('none');
      timeOut = setTimeout(() => {
        setCurrentChart(charts.lineChart);
      }, 0);

      windowSize.width = window.innerWidth;
      windowSize.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (timeOut) {
        clearTimeout(timeOut);
      }
    };
  }, [isMobileView, isTabletView]);

  return (
    <ChartProvider>
      <div className="buffer">
        <div className="container">
          <div
            style={{
              height: '550px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {currentChart === charts.candleChart && (
              <CandleSeries
                interval={currentInteraval}
                barSize={barSize}
                width={width}
                height={height}
                isMobileView={isMobileView}
              />
            )}
            {currentChart === charts.lineChart && (
              <LineSeries
                interval={currentInteraval}
                barSize={barSize}
                width={width}
                height={height}
                isMobileView={isMobileView}
                onPrice={onPrice}
              />
            )}
            {currentChart === charts.orderBook && (
              <Row
                style={{
                  width: '100%',
                  minHeight: '500px',
                  alignItems: 'center',
                }}
              >
                <Col flex="auto">
                  <Orderbook
                    depth={depth}
                    smallScreen={smallScreen}
                    onPrice={onPrice}
                    onSize={onSize}
                  />
                </Col>
              </Row>
            )}
          </div>

          {/* buttons row */}
          <div
            className="switch-container"
            style={{
              position: 'relative',
              zIndex: 2,
            }}
            id="switch-container"
          >
            {/* time buttons */}
            <div className="switcher">
              {intervals.map((item, index) => (
                <button
                  key={index}
                  className={`switcher-item ${
                    item === currentInteraval ? 'switcher-active-item' : ''
                  }`}
                  onClick={() => onIntervalChangeHandler(item)}
                >
                  {item.toLocaleUpperCase()}
                </button>
              ))}
            </div>
            {/* graph buttons */}
            <div>
              <button
                className={
                  'switch-to-order-book ' +
                  (currentChart === charts.orderBook ? 'shown' : '')
                }
                onClick={() => {
                  setCurrentChart(charts.orderBook);
                }}
              >
                <img src={OrderBookSvg} alt="Book" style={{ width: 24 }} />
              </button>
              <button
                type="button"
                id="chart-toggle"
                className="chart-toggle"
                onClick={onChartsChangeHandler}
              >
                {' '}
                <img
                  src={currentChart === charts.lineChart ? CandleSvg : LineSvg}
                  alt="Candle"
                  style={{ width: 24 }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ChartProvider>
  );
};

export default NormalChart;
