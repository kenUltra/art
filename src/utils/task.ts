export interface itask {
  uuid: number;
  title: string;
  description: string | '';
  timeCount: number | 1;
  isPriority: boolean;
}
export interface iTime {
  hour: number | string;
  min: number | string;
  sec: number | string;
}
export interface iTaskResp {
  isCorrect: boolean;
  message: string;
}
export const formatTime = (ms: number): iTime => {
  const totalSecond: number = Math.floor(ms * 60),
    hour: number = Math.floor(totalSecond / 3600),
    minute: number = Math.floor((totalSecond % 3600) / 60),
    second: number = Math.floor(totalSecond % 60),
    formatHour: string = hour.toString().padStart(2, '0'),
    formatMinute: string = minute.toString().padStart(2, '0'),
    formatSecond: string = second.toString().padStart(2, '0');

  return {
    hour: formatHour,
    min: formatMinute,
    sec: formatSecond,
  };
};
export const taskIconPath: string =
  'M1709.78,1122.57c21.174,-10.587 34.55,-32.228 34.55,-55.901c-0,-23.674 -13.376,-45.315 -34.55,-55.902c-278.945,-139.473 -1001.44,-500.719 -1256.08,-628.04c-19.374,-9.687 -42.383,-8.651 -60.809,2.736c-18.426,11.388 -29.642,31.505 -29.642,53.166c0,267.07 0,989.01 0,1256.08c0,21.661 11.216,41.778 29.642,53.166c18.426,11.388 41.435,12.423 60.809,2.736c254.641,-127.321 977.134,-488.567 1256.08,-628.04Z';
