// types/highway.ts
export interface Highway {
  _id: string;
  id: number;
  name: string;
  status: "active" | "disused" | "unlisted";
  routeName?: string;
  length: number; // 數字型別
  currentLength?: number;
  start: string;
  currentStart?: string;
  end: string;
  currentEnd?: string;
  otherName?: string[]; // 我們把原本逗號隔開的字串變成「陣列」
  highest?: number;
  highestPlace?: string;
  remark?: string;
  images?: {
    _id: string;
    url: string; // 圖片位址 (例如 /images/t1_01.jpg)
    description: string; // 圖片描述 (例如 "台1線起點行政院前")
    capturedAt: Date; // 選填：拍攝日期
  }[];
}
