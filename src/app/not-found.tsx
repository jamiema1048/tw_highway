import React from "react";
import Link from "next/link";

const NotFound = (): React.ReactElement => {
  return (
    <>
      <div>
        <h2>Page not found</h2>
        <p>Could not find requested resource</p>
        <p>
          <Link href="/">Home</Link>
        </p>
      </div>
    </>
  );
};

export default NotFound;
