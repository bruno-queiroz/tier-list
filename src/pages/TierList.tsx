import React, { useState } from "react";
import { AiFillSetting as SettingsIcon } from "react-icons/ai";
import {
  MdOutlineKeyboardArrowDown as ArrowDownIcon,
  MdOutlineKeyboardArrowUp as ArrowUpIcon,
} from "react-icons/md";

import { mockData, imagesTest } from "../../public/mockData";

export interface TierList {
  color: string;
  text: string;
  tierListSelectedItems: string[];
}

const TierList = () => {
  const [tierList, setTierList] = useState<TierList[]>(mockData);
  const [tierListItems, setTierListItems] = useState(imagesTest);
  const dragStartHandle = (event: React.DragEvent<HTMLImageElement>) => {
    const imageSrc = event.currentTarget.src;
    const tierListItemIndex = event.currentTarget.dataset?.tierlistItemIndex;
    const dragStartRowIndex = (event.target as HTMLDivElement).parentElement
      ?.dataset?.rowIndex;

    event.dataTransfer.setData("text/uri-list", imageSrc);
    event.dataTransfer.setData(
      "text/plain",
      `${tierListItemIndex}-${dragStartRowIndex}`
    );

    var img = document.createElement("img");

    img.src = "http://localhost:5173/public/images/about01.png";
    img.style.width = "140px";
    img.style.height = "120px";
    event.dataTransfer.setDragImage(img, 0, 0);
  };
  const dragOverHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const dropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedRowIndex = Number(
      (event.nativeEvent.target as HTMLDivElement).dataset?.rowIndex as string
    );
    const imageSrc = event.dataTransfer.getData("URL");
    const isTierListItemSelected = event.dataTransfer.getData("text");
    console.log(isTierListItemSelected);
    if (isTierListItemSelected !== "undefined-undefined") {
      const [tierListItemIndex, dragStartRowIndex] =
        isTierListItemSelected.split("-");
      const updatedTierListItems = [
        ...tierList[Number(dragStartRowIndex)].tierListSelectedItems,
      ];
      updatedTierListItems.splice(Number(tierListItemIndex), 1);

      const filteredTierListItems = tierList.map((tierListItem, index) => {
        if (index === Number(dragStartRowIndex)) {
          tierListItem.tierListSelectedItems = updatedTierListItems;
        }
        return tierListItem;
      });
      setTierList(filteredTierListItems);
    } else {
      const filteredTierListItems = tierListItems.filter((item) => {
        const fileName = imageSrc.split("/")[4];
        if (!item.includes(fileName)) {
          return item;
        }
      });
      setTierListItems(filteredTierListItems);
    }

    const updatedTierList = tierList.map((tierListRow, index) => {
      if (index === droppedRowIndex) {
        tierListRow.tierListSelectedItems.push(imageSrc);
      }
      return tierListRow;
    });
    setTierList(updatedTierList);
  };
  return (
    <section className="flex flex-col gap-6 p-4">
      <h1 className="text-5xl font-bold text-center my-4">~ Tier List</h1>

      <div className="flex flex-col">
        {tierList.map((row, index) => (
          <div className="flex border-b-[3px] border-black" key={index}>
            <div
              className="grid place-content-center"
              style={{ backgroundColor: row.color }}
            >
              <div
                className={`grid place-content-center text-xl w-[140px] h-[120px] text-[#1A1A17] p-4 overflow-hidden text-center`}
              >
                {row.text}
              </div>
            </div>

            <div
              className="flex flex-wrap bg-[#1A1A17] flex-1"
              onDragOver={dragOverHandler}
              onDrop={dropHandler}
              data-row-index={index}
            >
              {row.tierListSelectedItems.map((tierListItem, index) => (
                <img
                  key={index}
                  className="w-[140px] h-[120px] bg-green-400 cursor-pointer"
                  draggable="true"
                  onDragStart={dragStartHandle}
                  data-tierlist-item-index={index}
                  src={tierListItem}
                />
              ))}
            </div>
            <div className="bg-black">
              <div className="flex items-center leading-[0] h-[120px] gap-2 text-5xl">
                <button>
                  <SettingsIcon />
                </button>
                <div className="flex flex-col">
                  <button>
                    <ArrowUpIcon />
                  </button>
                  <button>
                    <ArrowDownIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap">
        {tierListItems.map((tierListItem, index) => (
          <img
            key={index}
            className="w-[140px] h-[120px] bg-green-400 cursor-pointer"
            draggable="true"
            onDragStart={dragStartHandle}
            src={tierListItem}
          />
        ))}
      </div>

      <button className="py-2 px-6 rounded bg-S w-[max-content] mx-auto my-4">
        Download
      </button>
    </section>
  );
};

export default TierList;
