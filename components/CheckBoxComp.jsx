"use client";

import React from "react";

export const CheckBoxComp = React.forwardRef(
  ({ intermediate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolveRef = ref || defaultRef;

    React.useEffect(() => {
      resolveRef.current.intermediate = intermediate;
    }, [resolveRef, intermediate]);
    return (
      <>
        <input type="checkbox" ref={resolveRef} {...rest} />
      </>
    );
  }
);

CheckBoxComp.displayName = "CheckBoxComp";
