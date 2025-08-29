// types/highway.ts
export interface Highway {
  id: string;
  name: string;
  prefix?: string;
  description?: string;
  images?: string[];
  currentImageIndex?: number;
  theMostCorres?: string;
}
