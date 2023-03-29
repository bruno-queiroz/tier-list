import React from "react";
import { TierListItem } from "../pages/TierList";

const TierListPreviewItem = ({ src, opacity }: TierListItem) => {
  return (
    <img
      className="w-[140px] h-[120px] cursor-pointer pointer-events-none"
      src={src}
      style={{ opacity: opacity }}
    />
  );
};

export default TierListPreviewItem;
