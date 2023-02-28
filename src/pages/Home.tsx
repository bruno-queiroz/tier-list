import React from "react";
import TierListCard from "../components/TierListCard";

const Home = () => {
  return (
    <main className="flex flex-col items-center gap-8 p-4">
      <h1 className="text-5xl font-bold text-center mt-4">Your Tier Lists</h1>
      <a
        href=""
        className="py-3 px-4 rounded bg-primary-light-red w-[max-content]"
      >
        Create Tier List
      </a>
      <div className="flex gap-4 flex-wrap justify-center">
        <TierListCard />
        <TierListCard />
        <TierListCard />
        <TierListCard />
        <TierListCard />
        <TierListCard />
        <TierListCard />
        <TierListCard />
      </div>
    </main>
  );
};

export default Home;
