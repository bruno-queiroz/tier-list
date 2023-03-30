import React from "react";
import { useParams } from "react-router";
import { patchTierList } from "../fetch/patchTierList";
import { TierList } from "../pages/TierList";
import { throttle } from "../utils/throttle";
import { useTierListStore } from "../zustandStore/store";
type TierNameProps = TierList & { index: number };

const typeThrottle = throttle();

const TierName = ({ color, text, index }: TierNameProps) => {
  const { tierListID } = useParams();
  const tierList = useTierListStore((state) => state.tierList);
  const setTierList = useTierListStore((state) => state.setTierList);

  const updateItemText = (
    event: React.FormEvent<HTMLDivElement>,
    rowIndex: number
  ) => {
    const updatedTierList = [...tierList];
    updatedTierList[rowIndex].text = event.currentTarget.textContent || "";
    typeThrottle(() => patchTierList(tierListID!, updatedTierList));

    setTierList(updatedTierList);
  };

  return (
    <div
      className="grid place-content-center relative"
      style={{ backgroundColor: color }}
    >
      <div className="text-xl p-4 py-[46px] w-[140px] min-h-[120px] text-[#1A1A17] text-center">
        {text}
      </div>
      <div
        className={`text-xl p-4 py-[46px] w-[140px] min-h-[120px] text-[#1A1A17] text-center absolute inset-0`}
        contentEditable
        style={{
          color: "transparent",
        }}
        onInput={(e) => updateItemText(e, index)}
      ></div>
    </div>
  );
};

export default TierName;
