"use client";

import { FC } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const Error: FC<ErrorProps> = ({ error, reset }) => {
  return (
    <div>
      <h2>{error.message}</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
};

export default Error;
