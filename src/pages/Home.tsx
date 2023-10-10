import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TierListCard from "../components/TierListCard";
import { getTierLists } from "../fetch/getTierLists";
import TierListsSkeleton from "../components/TierListsSkeleton";
import { TierListFormData } from "./CreateTierList";

type TierListData = TierListFormData & { _id: string };

const Home = () => {
  const [tierLists, setTierLists] = useState<TierListData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const tierList = await getTierLists();
      setTierLists(tierList?.data);
      setIsLoading(false);
    })();
  }, []);

  return (
    <main className="flex flex-col items-center gap-8 p-4">
      <h1 className="text-5xl font-bold text-center mt-4">Your Tier Lists</h1>
      <Link
        to="/create-tier-list"
        className="py-3 px-4 rounded bg-D font-semibold text-primaryDarkGray w-[max-content]"
      >
        Create Tier List
      </Link>

      {isLoading ? (
        <TierListsSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-tier-lists gap-4 w-full justify-center max-w-[945px]">
            {tierLists?.map((tierListData, index) => (
              <TierListCard key={index} {...tierListData} />
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default Home;
