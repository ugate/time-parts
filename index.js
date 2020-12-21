module.exports = {
  formattedTime,
  timeSlots
};

/**
 * Breaks a given time down to __days__, __hours__, __minutes__, __seconds__, __milliseconds__ (included when `time` is `BitInt`) and __microseconds__
 * (included when `time` is `BitInt`).
 * @param {Number|BitInt} time The time that will be used. Milliseconds and microseconds will only be included when a `BigInt` is passed. In which case,
 * the passed `time` is assumed to be in nanoseconds. Otherwise, `time` is assumed to be in milliseconds.
 * time is assumed to be in milliseconds.
 * @param {String} [delimiter=':'] The delimiter that will be used for value separations.
 * @returns {Object[]} The time slots. Each time slot item will have the following properties:
 * 1. The `BigInt` time value
 * 1. The delimiter used for the time slot
 * 1. The full label fo the time slot
 * 1. The abbreviated label for the time slot 
 */
function timeSlots(time, delimiter = ':') {
  const isNano = typeof time === 'bigint';
  const tm = isNano ? time : BigInt(time) * 1000000n;
  const tms = [];
  // TODO : Add year, months option?
  tms.push({
    time: tm / 86400000000000n | 0n,
    delimiter: delimiter === ':' ? ':' : delimiter,
    label: 'days',
    abbreviation: 'days'
  });
  tms.push({
    time: (tm % 86400000000000n) / 3600000000000n | 0n,
    delimiter: delimiter === ':' ? ':' : delimiter,
    label: 'hours',
    abbreviation: 'hrs'
  });
  tms.push({
    time: (tm % 3600000000000n) / 60000000000n | 0n,
    delimiter: delimiter === ':' ? ':' : delimiter,
    label: 'minutes',
    abbreviation: 'mins'
  });
  tms.push({
    time: (tm % 60000000000n) / 1000000000n | 0n,
    delimiter: delimiter === ':' ? ':' : delimiter,
    label: 'seconds',
    abbreviation: 'secs'
  });
  if (isNano) {
    tms.push({
      time: (tm % 1000000000n) / 1000000n | 0n,
      delimiter: delimiter === ':' ? '.' : delimiter,
      label: 'milliseconds',
      abbreviation: 'ms'
    });
    tms.push({
      time: (tm % 1000000n) / 1000n | 0n,
      delimiter: delimiter === ':' ? '.' : delimiter,
      label: 'microseconds',
      abbreviation: 'μs'
    });
  }
  return tms;
}

/**
 * Breaks a given time down to __days__, __hours__, __minutes__, __seconds__, __milliseconds__ (included when `time` is `BitInt`) and __microseconds__
 * (included when `time` is `BitInt`) into a textual format.
 * @example `formatTimeSlots(187568010012000n, 'LABEL', true, true) === '02 days 04 hours 06 minutes 08 seconds 10 milliseconds 12 '` 
 * @param {Number|BigInt} time The time that will be used. Milliseconds and microseconds will only be included when a `BigInt` is passed. In which case,
 * the passed `time` is assumed to be in nanoseconds. Otherwise, `time` is assumed to be in milliseconds.
 * time is assumed to be in milliseconds.
 * @param {String} [delimiter=':'] The delimiter that will be used for value separations. A value of `LABEL` will use the time slot label. A value of
 * `ABBREVIATED` will use the abbreviated label for the time slot. 
 * @param {Boolean} [spaced] Truthy to add spaces between formatted time parts.
 * @param {Boolean} [includeOnlyNonZeroStart] Truthy to only include time slots from the first time slot that has a non-zero value. For instance,
 * time slots that have `0 days, 2 hours, 4 minutes, and 8 seconds` will include only `2 hours, 4 minutes and 8 seconds`.
 * @returns {String} The formatted timeframe
 */
function formattedTime(time, delimiter = ':', spaced = false, includeOnlyNonZeroStart = false) {
  const tms = timeSlots(time, delimiter);
  let text = '';
  let hasVal;
  for (let tm of tms) {
    hasVal = includeOnlyNonZeroStart ? hasVal || tm.time : true;
    if (!hasVal) {
      continue;
    }
    text += `${
      (delimiter !== 'ABBREVIATED' && delimiter !== 'LABEL' && text.length && `${spaced ? ' ' : ''}${tm.delimiter}${spaced ? ' ' : ''}`) || ''
    }${
      ('00' + tm.time).slice(-2)
    }${
      `${spaced ? ' ' : ''}${
        (delimiter === 'ABBREVIATED' && tm.abbreviation) || (delimiter === 'LABEL' && tm.label) || ''
      }${spaced ? ' ' : ''}`
    }`;
  }
  return text;
}