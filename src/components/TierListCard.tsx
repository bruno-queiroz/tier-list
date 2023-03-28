import React from "react";
import { Link } from "react-router-dom";
import { TierList } from "../fetch/getTierLists";

const TierListCard = ({ tierListName, tierListImage, _id }: TierList) => {
  return (
    <Link to={`tierList/${tierListName}/${_id}`}>
      <article className="flex flex-col gap-4 bg-gray-800 p-3 rounded">
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
