import React from "react";

const TierListSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 bg-primaryDarkGray p-3 rounded">
      <div className="w-[200px] h-[150px] bg-[#20201D] object-cover" />
      <span className="h-[8px] w-[50px] bg-gray-400" />
    </div>
  );
};

const TierListsSkeleton = () => {
  return (
    <div className="grid grid-cols-tier-lists justify-center gap-4 w-full max-w-[940px]">
      <TierListSkeleton />
      <TierListSkeleton />
      <TierListSkeleton />
      <TierListSkeleton />
      <TierListSkeleton />
      <TierListSkeleton />
    </div>
  );
};

export default TierListsSkeleton;
