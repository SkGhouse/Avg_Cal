
export type NumberType = 'p' | 'f' | 'e' | 'r';

export interface NumberResponse {
  numbers: number[];
  isMock?: boolean;
}

export interface WindowState {
  windowPrevState: number[];
  windowCurrState: number[];
  numbers: number[];
  avg: number;
  isMock?: boolean;
}
