import React from "react";

function Badge(item: any) {
  return (
    <span key={item} className="pf-c-badge pf-m-read">
      {item} badge
    </span>
  );
}

export default Badge;
