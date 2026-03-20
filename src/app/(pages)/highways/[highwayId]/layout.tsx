"use client";
import { ReactNode } from "react";

interface HighwayContentLayoutProps {
  children: ReactNode;
}

const HighwayContentLayout = ({ children }: HighwayContentLayoutProps) => {
  return <>{children}</>;
};

export default HighwayContentLayout;
