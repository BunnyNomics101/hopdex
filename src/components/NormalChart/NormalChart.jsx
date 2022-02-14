import React, { useState } from 'react';
import LineSvg from './line.svg';
import CandleSvg from './candles.svg';

import CandleSeries from './CandleSeries';
import LineSeries from './LineSeries';
import './normalChart.css';

const intervals = ['1d', '1w', '1m', '3m', '1y'];
const charts = {
  candleChart: 'Candle Chart',
  lineChart: 'Line Chart',
};
const NormalChart = ({ width, height, isMobileView }) => {
  const [currentInteraval, setCurrentInterval] = useState('1d');
  const [currentChart, setCurrentChart] = useState(charts.lineChart);
  const [barSize, setBarSize] = useState(10);
  const onChartsChangeHandler = () => {
    const toggledChart =
      currentChart === charts.candleChart
        ? charts.lineChart
        : currentChart === charts.lineChart
        ? charts.candleChart
        : '';
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
  return (
    <div className="buffer">
      <div className="container">
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
          />
        )}
        <div className="switch-container" id="switch-container">
          <div className="switcher">
            {intervals.map((item,index) => (
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

          <div>
            <button
              type="button"
              id="chart-toggle"
              className="chart-toggle"
              onClick={onChartsChangeHandler}
            >
              {' '}
              {currentChart === charts.candleChart && (
                <img src={LineSvg} alt="Line" style={{ width: 24 }} />
              )}
              {currentChart === charts.lineChart && (
                <img src={CandleSvg} alt="Candle" style={{ width: 24 }} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NormalChart;
