import { Link } from "react-router-dom";

interface TierListCardProps {
  tierListName: string;
  tierListImage: string;
  _id: string;
}

const TierListCard = ({
  tierListName,
  tierListImage,
  _id,
}: TierListCardProps) => {
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
