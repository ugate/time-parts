# time-parts
Extracts time parts from nanoseconds or milliseconds with label formatter

```js
let timeLabel;

timeLabel = time_parts.formattedTime(187568010012000n);
// result:
// 02:04:06:08.10.12

timeLabel = time_parts.formattedTime(187568010012000n, 'LABEL', true);
// result:
// 02 days 04 hours 06 minutes 08 seconds 10 milliseconds 12 microseconds

timeLabel = time_parts.formattedTime(187568010012000n, 'ABBREVIATED', true);
// result:
// 02 days 04 hrs 06 mins 08 secs 10 ms 12 μs

timeLabel = time_parts.formattedTime(187568010012000n, 'ABBREVIATED');
// result:
// 02days04hrs06mins08secs10ms12μs

// omit zeroed days
timeLabel = time_parts.formattedTime(17568010012000n, 'LABEL', true, true);
// result:
// 04 hours 52 minutes 48 seconds 10 milliseconds 12 microseconds
```
