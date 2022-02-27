/* eslint-disable no-fallthrough */
export const getTimeData = (interval) => {
  let days = 1;
  let endTime = parseInt(new Date().getTime() / 1000);
  switch (interval) {
    case '1d': {
      days = 1;
      const difference = 60 * 60 * 24 * days;
      const currentTime = endTime - difference;
      return [{ currentTime, endTime }];
    }
    case '1w': {
      days = 7;
      const difference = 60 * 60 * 24 * days;
      const currentTime = endTime - difference;
      return [{ currentTime, endTime }];
    }
    case '1m': {
      days = 30;
      const difference = 60 * 60 * 24 * days;
      const currentTime = endTime - difference;
      return [{ currentTime, endTime }];
    }
    case '3m': {
      days = 3 * 30;
      const difference = 60 * 60 * 24 * days;
      const currentTime = endTime - difference;
      return [{ currentTime, endTime }];
    }
    case '1y': {
      return [...Array(12)].map(() => {
        days = 1 * 30;
        const difference = 60 * 60 * 24 * days;
        const currentTime = endTime - difference;
        const returnObj = { currentTime, endTime };
        endTime = currentTime - 10000;
        return returnObj;
      });
    }
    case '5y': {
      return [...Array(5 * 12)].map(() => {
        days = 1 * 30;
        const difference = 60 * 60 * 24 * days;
        const currentTime = endTime - difference;
        const returnObj = { currentTime, endTime };
        endTime = currentTime - 10000;
        return returnObj;
      });
    }
    default: {
      days = 1;
      const difference = 60 * 60 * 24 * days;
      const currentTime = endTime - difference;
      return [{ currentTime, endTime }];
    }
  }
};

export const formatDifference = (price, previousPrice) => {
  var difference = (price - previousPrice).toFixed(2);
  var percent =
    '(' + Math.abs(((difference * 100) / previousPrice).toFixed(2)) + '%)';
  var differenceClassname = 'green';
  if (difference > 0) {
    differenceClassname = 'green';
    difference = '+$' + difference;
  } else if (difference < 0) {
    differenceClassname = 'red';
    difference = '-$' + Math.abs(difference);
  } else {
    differenceClassname = 'yellow';
    difference = '$' + difference;
  }

  var str = `<span class="tooltip__difference ${differenceClassname}">${difference}${percent}</span>`;
  return str;
};

export const formatPrice = (price) => {
  var hundredths = (price % 1).toFixed(2).toString().slice(1);
  var hundreds = Math.floor(price % 1000);
  // while (hundreds.toString().length < 3) {
  //   hundreds = '0' + hundreds;
  // }
  var thousands = Math.floor(price / 1000);
  thousands === 0 ? (thousands = '') : (thousands += ',');

  var str = `<span class="tooltip__price-small">$</span>${thousands}${hundreds}<span class="tooltip__price-small">${hundredths}</span>`;
  return str;
};

export const businessDayToString = (businessDay) => {
  return businessDay.year + '-' + businessDay.month + '-' + businessDay.day;
};
