import { Link } from "react-router-dom";

interface TierListCardProps {
  tierListName: string;
  tierListImage: string;
  _id: string;
  index: number;
}

const TierListCard = ({
  tierListName,
  tierListImage,
  _id,
  index,
}: TierListCardProps) => {
  return (
    <Link to={`tier-list/${_id}`} data-testid={`tier-list-card-${index}`}>
      <article className="flex flex-col gap-4 bg-primaryDarkGray p-3 rounded">
        <img
          src={tierListImage}
          alt="tier list cover image"
          className="w-[200px] h-[150px] bg-transparent object-cover"
        />
        <span>{tierListName}</span>
      </article>
    </Link>
  );
};

export default TierListCard;
