import React from "react";
import { Link } from "react-router-dom";
import { TierListResponse } from "../fetch/getTierLists";

const TierListCard = ({
  tierListName,
  tierListImage,
  _id,
}: TierListResponse) => {
  return (
    <Link to={`tier-list/${_id}`}>
      <article className="flex flex-col gap-4 bg-primaryDarkGray p-3 rounded">
        <img
          src={tierListImage}
          alt=""
          className="w-[200px] h-[150px] bg-transparent object-cover"
        />
        <span>{tierListName}</span>
      </article>
    </Link>
  );
};

export default TierListCard;
