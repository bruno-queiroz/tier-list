import React, { useState } from "react";
import { AiFillSetting as SettingsIcon } from "react-icons/ai";
import {
  MdOutlineKeyboardArrowDown as ArrowDownIcon,
  MdOutlineKeyboardArrowUp as ArrowUpIcon,
} from "react-icons/md";

import Modal from "../components/Modal";
import ModalRowManipulation from "../components/ModalRowManipulation";
import { useTierListStore } from "../zustandStore/store";

export interface TierListItems {
  src: string;
  opacity?: string;
}

export interface TierList {
  color: string;
  text: string;
  tierListSelectedItems: TierListItems[];
}

interface DragEnterDataTransfer {
  src: string;
  tierListItemIndex: string | undefined;
  dragStartRowIndex: string | undefined;
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
  const [dragEnterDataTransfer, setDragEnterDataTransfer] =
    useState<DragEnterDataTransfer>({
      src: "",
      tierListItemIndex: undefined,
      dragStartRowIndex: undefined,
    });
  const [dragEnterPreviewItemIndex, setDragEnterPreviewItemIndex] = useState(0);
  const [
    dragEnterPreviewNotSelectedItemIndex,
    setDragEnterPreviewNotSelectedItemIndex,
  ] = useState(-1);

  const dragStartHandle = (event: React.DragEvent<HTMLImageElement>) => {
    const updatedTierList = [...tierList];
    const imageSrc = event.currentTarget.src;
    const tierListItemIndex = event.currentTarget.dataset?.tierlistItemIndex;
    const dragStartRowIndex = (event.target as HTMLDivElement).parentElement
      ?.dataset?.rowIndex;
    const wasItemNotSelected =
      event.currentTarget.dataset?.itemNotSelectedIndex;

    event.dataTransfer.setData("text/uri-list", imageSrc);
    event.dataTransfer.setData(
      "text/plain",
      `${tierListItemIndex}-${dragStartRowIndex}`
    );
    setDragEnterDataTransfer({
      src: imageSrc,
      dragStartRowIndex,
      tierListItemIndex,
    });

    if (wasItemNotSelected) {
      const updatedTierListItems = [...tierListItems];

      setTimeout(() => {
        updatedTierListItems.splice(Number(wasItemNotSelected), 1);
      }, 0);

      setTierListItems(updatedTierListItems);
      return;
    }

    setTimeout(() => {
      updatedTierList[Number(dragStartRowIndex)].tierListSelectedItems.splice(
        Number(tierListItemIndex),
        1
      );
    }, 0);
    setTierList(updatedTierList);
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
    const updatedTierList = [...tierList];
    const wasItemNotSelected = event.dataTransfer.getData("text");

    if (wasItemNotSelected === "undefined-undefined") {
      const updatedTierListItems = tierListItems.filter(
        (item) => item.src !== imageSrc
      );
      setTierListItems(updatedTierListItems);
    }

    updatedTierList[droppedRowIndex].tierListSelectedItems.splice(
      itemDroppedIndex,
      0,
      { src: imageSrc }
    );

    setTierList(updatedTierList);
  };

  const onDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedRowIndex = Number(
      (event.nativeEvent.target as HTMLDivElement).dataset?.rowIndex
    );
    const imageSrc = event.dataTransfer.getData("URL");
    const updatedTierList = [...tierList];
    const wasItemNotSelected = event.dataTransfer.getData("text");

    if (wasItemNotSelected.includes("undefined")) {
      const updatedTierListItems = tierListItems.filter(
        (item) => item.src !== imageSrc
      );
      setTierListItems(updatedTierListItems);
    }

    const lastItemIndex =
      tierList[droppedRowIndex].tierListSelectedItems.length - 1;
    const isLastitemAPreview =
      tierList[droppedRowIndex].tierListSelectedItems[lastItemIndex]?.opacity;

    if (isLastitemAPreview) {
      updatedTierList[droppedRowIndex].tierListSelectedItems.push({
        src: imageSrc,
      });
    } else {
      updatedTierList[droppedRowIndex].tierListSelectedItems.splice(
        dragEnterPreviewItemIndex,
        0,
        {
          src: imageSrc,
        }
      );
    }
    clearItemPreviewSpecificRow(droppedRowIndex);

    setTierList(updatedTierList);
  };

  const onDropItemNotSelectedHandle = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const imageSrc = event.dataTransfer.getData("URL");
    const itemDroppedIndex = Number(
      (event.nativeEvent.target as HTMLDivElement)?.dataset
        ?.itemNotSelectedIndex
    );
    const updatedTierListItems = tierListItems.filter(
      (item) => item.src !== imageSrc
    );
    updatedTierListItems.splice(itemDroppedIndex, 0, { src: imageSrc });

    setTierListItems(updatedTierListItems);
  };

  const onDropItemsNotSelectedHandle = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.preventDefault();

    const lastItemIndex = tierListItems.length - 1;
    const isLastItemAPreview = tierListItems[lastItemIndex]?.opacity;

    const imageSrc = event.dataTransfer.getData("URL");

    const tierListItemsPreviewCleared =
      clearItemPreviewNotSelected(tierListItems);

    if (isLastItemAPreview) {
      setTierListItems([...tierListItemsPreviewCleared, { src: imageSrc }]);
    } else {
      tierListItemsPreviewCleared.splice(
        dragEnterPreviewNotSelectedItemIndex,
        0,
        { src: imageSrc }
      );

      setTierListItems(tierListItemsPreviewCleared);
    }
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
    const updatedTierList = [...tierList];
    const itemSelected = updatedTierList.slice(
      selectedItemIndex,
      selectedItemIndex + 1
    );
    const desirablePlaceItem = updatedTierList.slice(
      selectedItemIndex - 1,
      selectedItemIndex
    );

    updatedTierList.splice(selectedItemIndex - 1, 1, ...itemSelected);
    updatedTierList.splice(selectedItemIndex, 1, ...desirablePlaceItem);
    setTierList(updatedTierList);
  };
  const moveItemdown = (selectedItemIndex: number) => {
    if (tierList.length - 1 <= selectedItemIndex) return;
    const updatedTierList = [...tierList];
    const itemSelected = updatedTierList.slice(
      selectedItemIndex,
      selectedItemIndex + 1
    );

    const desirablePlaceItem = updatedTierList.slice(
      selectedItemIndex + 1,
      selectedItemIndex + 2
    );
    updatedTierList.splice(selectedItemIndex + 1, 1, ...itemSelected);
    updatedTierList.splice(selectedItemIndex, 1, ...desirablePlaceItem);
    setTierList(updatedTierList);
  };

  const onDragEnterARow = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const enterRowIndex = Number(
      (event.nativeEvent.target as HTMLDivElement).dataset?.rowIndex
    );
    if (!enterRowIndex && enterRowIndex !== 0) return;
    const updatedTierList = [...tierList];
    const lastItem = tierList[enterRowIndex].tierListSelectedItems.length - 1;
    const isPreviewAlreadyActive = tierList[
      enterRowIndex
    ].tierListSelectedItems.some(
      (item, index) => item?.opacity && index <= lastItem
    );

    if (isPreviewAlreadyActive) return;

    const tierListItemPreviewsCleared =
      clearItemPreviewAllRows(updatedTierList);

    tierListItemPreviewsCleared[enterRowIndex].tierListSelectedItems.push({
      src: dragEnterDataTransfer.src,
      opacity: "0.5",
    });

    setTierList(tierListItemPreviewsCleared);
  };
  const onDragLeaveARow = (event: React.DragEvent<HTMLDivElement>) => {
    const leaveRowIndex = Number(
      (event.nativeEvent.target as HTMLDivElement).dataset?.rowIndex
    );

    if (!leaveRowIndex && leaveRowIndex !== 0) return;

    const lastItemIndex =
      tierList[leaveRowIndex].tierListSelectedItems.length - 1;
    const isLastItemAPreview =
      tierList[leaveRowIndex].tierListSelectedItems[lastItemIndex]?.opacity;

    if (!isLastItemAPreview) return;
    clearItemPreviewSpecificRow(leaveRowIndex);
  };

  const clearItemPreviewSpecificRow = (rowIndex: number) => {
    if (!rowIndex && rowIndex !== 0) return;

    const updatedTierList = [...tierList];
    updatedTierList[rowIndex].tierListSelectedItems = updatedTierList[
      rowIndex
    ].tierListSelectedItems.filter((item) => !item?.opacity);
    setTierList(updatedTierList);
  };

  const clearItemPreviewAllRows = (tierList: TierList[]) => {
    const updatedTierList = [...tierList].map((row) => ({
      ...row,
      tierListSelectedItems: row.tierListSelectedItems.filter(
        (item) => !item?.opacity
      ),
    }));
    return updatedTierList;
  };
  const clearItemPreviewNotSelected = (tierListItems: TierListItems[]) => {
    const updatedTierListItems = [...tierListItems].filter(
      (item) => !item?.opacity
    );
    return updatedTierListItems;
  };
  const onDragEnterSelectedItemPreview = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const updatedTierList = [...tierList];
    const enterItemIndex = Number(
      (event.nativeEvent.target as HTMLDivElement).dataset?.tierlistItemIndex
    );
    const enterItemRowIndex = Number(
      (event.nativeEvent.target as HTMLDivElement)?.parentElement?.dataset
        ?.rowIndex
    );
    if (!enterItemRowIndex && enterItemRowIndex !== 0) return;
    setDragEnterPreviewItemIndex(enterItemIndex);
    clearItemPreviewSpecificRow(enterItemRowIndex);

    updatedTierList[enterItemRowIndex].tierListSelectedItems.splice(
      enterItemIndex,
      0,
      {
        src: dragEnterDataTransfer.src,
        opacity: "0.5",
      }
    );
    setTierList(updatedTierList);
  };

  const onDragEnterNotSelectedArea = () => {
    const isItemPreviewAlreadyAdded = tierListItems.some(
      (item) => item?.opacity
    );
    if (isItemPreviewAlreadyAdded) return;
    const imageSrc = dragEnterDataTransfer.src;
    setTierListItems([...tierListItems, { src: imageSrc, opacity: "0.5" }]);
  };

  const onDragEnterNotSelectedItem = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();

    const imageSrc = dragEnterDataTransfer.src;
    const tierListItemNotSelectedIndex = (
      event.nativeEvent.target as HTMLDivElement
    ).dataset?.itemNotSelectedIndex;

    if (!tierListItemNotSelectedIndex) return;
    setDragEnterPreviewNotSelectedItemIndex(
      Number(tierListItemNotSelectedIndex)
    );

    const updatedTierListItems = clearItemPreviewNotSelected(tierListItems);

    updatedTierListItems.splice(Number(tierListItemNotSelectedIndex), 0, {
      src: imageSrc,
      opacity: "0.5",
    });

    setTierListItems(updatedTierListItems);
  };

  return (
    <section className="flex flex-col gap-6 p-4">
      <h1 className="text-5xl font-bold text-center my-4">~ fix input bug</h1>
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
              onDragEnter={onDragEnterARow}
              onDragLeave={onDragLeaveARow}
              data-row-index={index}
            >
              {row.tierListSelectedItems.map((tierListItem, index) => {
                if (tierListItem?.opacity) {
                  return (
                    <img
                      key={index}
                      className="w-[140px] h-[120px] bg-green-400 cursor-pointer pointer-events-none"
                      src={tierListItem.src}
                      style={{ opacity: tierListItem?.opacity }}
                    />
                  );
                } else {
                  return (
                    <img
                      key={index}
                      className="w-[140px] h-[120px] bg-green-400 cursor-pointer"
                      draggable="true"
                      onDragStart={dragStartHandle}
                      data-tierlist-item-index={index}
                      onDragOver={dragOverHandler}
                      onDrop={onDropItemHandler}
                      onDragEnter={onDragEnterSelectedItemPreview}
                      src={tierListItem.src}
                    />
                  );
                }
              })}
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
        onDrop={onDropItemsNotSelectedHandle}
        onDragOver={dragOverHandler}
        onDragEnter={onDragEnterNotSelectedArea}
      >
        {tierListItems.map((tierListItem, index) => {
          if (tierListItem?.opacity) {
            return (
              <img
                key={index}
                className="w-[140px] h-[120px] bg-green-400 cursor-pointer pointer-events-none"
                src={tierListItem.src}
                style={{ opacity: tierListItem?.opacity }}
              />
            );
          } else {
            return (
              <img
                key={index}
                className="w-[140px] h-[120px] bg-green-400 cursor-pointer"
                draggable="true"
                onDragStart={dragStartHandle}
                data-item-not-selected-index={index}
                onDragOver={dragOverHandler}
                onDrop={onDropItemNotSelectedHandle}
                onDragEnter={onDragEnterNotSelectedItem}
                src={tierListItem.src}
              />
            );
          }
        })}
      </div>

      <button className="py-2 px-6 rounded bg-S w-[max-content] mx-auto my-4">
        Download
      </button>
    </section>
  );
};

export default TierList;
