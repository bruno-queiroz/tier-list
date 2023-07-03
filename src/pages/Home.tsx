import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TierListCard from "../components/TierListCard";
import { getTierLists, TierListResponse } from "../fetch/getTierLists";
import TierListsSkeleton from "../components/TierListsSkeleton";

const Home = () => {
  const [tierLists, setTierLists] = useState<TierListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setTierLists(await getTierLists());
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
            {tierLists?.map((tierList, index) => (
              <TierListCard key={index} {...tierList} />
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default Home;
