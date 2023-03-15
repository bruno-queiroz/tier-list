import React from "react";
import { AiFillSetting as SettingsIcon } from "react-icons/ai";
import {
  MdOutlineKeyboardArrowDown as ArrowDownIcon,
  MdOutlineKeyboardArrowUp as ArrowUpIcon,
} from "react-icons/md";

import Modal from "../components/Modal";
import ModalRowManipulation from "../components/ModalRowManipulation";
import { useTierListStore } from "../zustandStore/store";

export interface TierList {
  color: string;
  text: string;
  tierListSelectedItems: string[];
}

const TierList = () => {
  const tierList = useTierListStore((state) => state.tierList);
  const setTierList = useTierListStore((state) => state.setTierList);
  const tierListItems = useTierListStore((state) => state.tierListItems);
  const setTierListItems = useTierListStore((state) => state.setTierListItems);
  const isRowModalOpen = useTierListStore((state) => state.isRowModalOpen);
  const changeRowModalIndex = useTierListStore(
    (state) => state.changeRowModalIndex
  );
  const changeRowModalState = useTierListStore(
    (state) => state.changeRowModalState
  );

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
  };

  const dragOverHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDropItemHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedRowIndex = Number(
      (event.nativeEvent.target as HTMLDivElement)?.parentElement?.dataset
        ?.rowIndex
    );
    const itemDroppedIndex = Number(
      (event.nativeEvent.target as HTMLDivElement)?.dataset?.tierlistItemIndex
    );
    const imageSrc = event.dataTransfer.getData("URL");
    const isTierListItemSelected = event.dataTransfer.getData("text");
    const tierListClone = [...tierList];

    if (isTierListItemSelected !== "undefined-undefined") {
      const [tierListItemIndex, dragStartRowIndex] =
        isTierListItemSelected.split("-");

      tierListClone[Number(dragStartRowIndex)].tierListSelectedItems.splice(
        Number(tierListItemIndex),
        1
      );
    } else {
      const tierListItemsClone = [...tierListItems];
      const tierListItemSelectedIndex = tierListItemsClone.indexOf(imageSrc);
      tierListItemsClone.splice(tierListItemSelectedIndex, 1);
      setTierListItems(tierListItemsClone);
    }
    tierListClone[droppedRowIndex].tierListSelectedItems.splice(
      itemDroppedIndex,
      0,
      imageSrc
    );

    setTierList(tierListClone);
  };

  const onDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const droppedRowIndex = Number(
      (event.nativeEvent.target as HTMLDivElement).dataset?.rowIndex
    );
    const imageSrc = event.dataTransfer.getData("URL");
    const isTierListItemSelected = event.dataTransfer.getData("text");
    const updatedTierList = [...tierList];

    if (isTierListItemSelected !== "undefined-undefined") {
      const [tierListItemIndex, dragStartRowIndex] =
        isTierListItemSelected.split("-");

      updatedTierList[Number(dragStartRowIndex)].tierListSelectedItems.splice(
        Number(tierListItemIndex),
        1
      );
    } else {
      const tierListItemsClone = [...tierListItems];
      const tierListItemSelectedIndex = tierListItemsClone.indexOf(imageSrc);
      tierListItemsClone.splice(tierListItemSelectedIndex, 1);
      setTierListItems(tierListItemsClone);
    }

    updatedTierList[droppedRowIndex].tierListSelectedItems.push(imageSrc);
    setTierList(updatedTierList);
  };

  const dropNotSelectedHandle = (event: React.DragEvent<HTMLDivElement>) => {
    // need refactoring
    const isTierListItemSelected = event.dataTransfer.getData("text");
    if (isTierListItemSelected === "undefined-undefined") return;
    const imageSrc = event.dataTransfer.getData("URL");
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

    setTierListItems([...tierListItems, imageSrc]);
  };

  const handleOpenModalRowManipulation = (selectedRowIndex: number) => {
    changeRowModalState(true);
    changeRowModalIndex(selectedRowIndex);
  };

  const updateItemText = (
    event: React.FormEvent<HTMLDivElement>,
    rowIndex: number
  ) => {
    const updatedTierList = [...tierList];
    updatedTierList[rowIndex].text = event.currentTarget.textContent || "";
    setTierList(updatedTierList);
  };
  const moveItemUp = (selectedItemIndex: number) => {
    if (selectedItemIndex === 0) return;
    const tierListClone = [...tierList];
    const itemSelected = tierListClone.slice(
      selectedItemIndex,
      selectedItemIndex + 1
    );
    const desirablePlaceItem = tierListClone.slice(
      selectedItemIndex - 1,
      selectedItemIndex
    );

    tierListClone.splice(selectedItemIndex - 1, 1, ...itemSelected);
    tierListClone.splice(selectedItemIndex, 1, ...desirablePlaceItem);
    setTierList(tierListClone);
  };
  const moveItemdown = (selectedItemIndex: number) => {
    if (tierList.length - 1 <= selectedItemIndex) return;
    const tierListClone = [...tierList];
    const itemSelected = tierListClone.slice(
      selectedItemIndex,
      selectedItemIndex + 1
    );

    const desirablePlaceItem = tierListClone.slice(
      selectedItemIndex + 1,
      selectedItemIndex + 2
    );
    tierListClone.splice(selectedItemIndex + 1, 1, ...itemSelected);
    tierListClone.splice(selectedItemIndex, 1, ...desirablePlaceItem);
    setTierList(tierListClone);
  };
  return (
    <section className="flex flex-col gap-6 p-4">
      <h1 className="text-5xl font-bold text-center my-4">~ Tier List</h1>
      {isRowModalOpen && (
        <Modal>
          <ModalRowManipulation />
        </Modal>
      )}

      <div className="flex flex-col">
        {tierList.map((row, index) => (
          <div className="flex border-b-[3px] border-black" key={index}>
            <div
              className="grid place-content-center relative"
              style={{ backgroundColor: row.color }}
            >
              <div className="text-xl p-4 py-[46px] w-[140px] min-h-[120px] text-[#1A1A17] text-center pointer-events-none bg-transparent absolute">
                {row.text}
              </div>
              <div
                className={`text-xl p-4 py-[46px] w-[140px] min-h-[120px] text-[#1A1A17] text-center `}
                contentEditable
                style={{ color: row.color }}
                onInput={(e) => updateItemText(e, index)}
              ></div>
            </div>

            <div
              className="flex flex-wrap bg-[#1A1A17] flex-1"
              onDragOver={dragOverHandler}
              onDrop={onDropHandler}
              data-row-index={index}
            >
              {row.tierListSelectedItems.map((tierListItem, index) => (
                <img
                  key={index}
                  className="w-[140px] h-[120px] bg-green-400 cursor-pointer"
                  draggable="true"
                  onDragStart={dragStartHandle}
                  data-tierlist-item-index={index}
                  onDragOver={dragOverHandler}
                  onDrop={onDropItemHandler}
                  src={tierListItem}
                />
              ))}
            </div>
            <div className="flex items-center bg-black">
              <div className="flex items-center leading-[0] h-[120px] gap-2 text-5xl">
                <button
                  className="pl-[5px]"
                  onClick={() => handleOpenModalRowManipulation(index)}
                >
                  <SettingsIcon />
                </button>
                <div className="flex flex-col">
                  <button onClick={() => moveItemUp(index)}>
                    <ArrowUpIcon />
                  </button>
                  <button onClick={() => moveItemdown(index)}>
                    <ArrowDownIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        className="flex flex-wrap w-full min-h-[135px] p-2 bg-gray-800"
        onDrop={dropNotSelectedHandle}
        onDragOver={dragOverHandler}
      >
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
