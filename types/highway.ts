// types/highway.ts
export interface Highway {
  id: number;
  routeName: string; // 台北－楓港
  length: number; // 數字型別
  currentLength?: number;
  start: string;
  currentStart?: string;
  end: string;
  currentEnd?: string;
  otherName?: [string]; // 我們把原本逗號隔開的字串變成「陣列」
  highest?: number;
  highestPlace?: string;
  remark?: string;
  images?: [
    {
      url: string; // 圖片位址 (例如 /images/t1_01.jpg)
      description: string; // 圖片描述 (例如 "台1線起點行政院前")
      capturedAt: Date; // 選填：拍攝日期
    },
  ];
}
