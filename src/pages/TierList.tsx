import html2canvas from "html2canvas";
import React, { useEffect, useRef, useState } from "react";
import { AiFillSetting as SettingsIcon } from "react-icons/ai";
import {
  MdOutlineKeyboardArrowDown as ArrowDownIcon,
  MdOutlineKeyboardArrowUp as ArrowUpIcon,
} from "react-icons/md";
import { useParams } from "react-router";

import Modal from "../components/Modal";
import ModalDownload from "../components/ModalDownload";
import ModalRowManipulation from "../components/ModalRowManipulation";
import TierListDroppablePart from "../components/TierListDroppablePart";
import TierName from "../components/TierName";
import { getTierList } from "../fetch/getTierList";
import { patchTierList } from "../fetch/patchTierList";
import { patchTierListItems } from "../fetch/patchTierListItems";
import { clearItemPreviewAllRows } from "../utils/clearItemPreviewAllRows";
import { clearItemPreviewNotSelected } from "../utils/clearItemPreviewNotSelected";
import { clearItemPreviewSpecificRow } from "../utils/clearItemPreviewSpecificRow";
import { dragOverHandler } from "../utils/dragOverHandler";
import { useTierListStore } from "../zustandStore/store";

export interface TierListItem {
  src: string;
  opacity?: string;
}

export interface TierList {
  color: string;
  text: string;
  tierListSelectedItems: TierListItem[];
}

export interface DragEnterDataTransfer {
  src: string;
  tierListItemIndex: string | undefined;
  dragStartRowIndex: string | undefined;
  isItemSelected: boolean;
  tierListNotSelectedItemIndex: string | undefined;
}

const TierList = () => {
  const { tierListID } = useParams();
  useEffect(() => {
    (async () => {
      const tierListAllData = await getTierList(tierListID!);
      const tierListData: TierList[] = JSON.parse(tierListAllData.tierList);
      const tierListItemsData: TierListItem[] = tierListAllData.tierListItems;
      setTierListItems(tierListItemsData);
      setTierList(tierListData);
    })();
  }, []);
  const tierList = useTierListStore((state) => state.tierList);
  const setTierList = useTierListStore((state) => state.setTierList);
  const setTierListCanvas = useTierListStore(
    (state) => state.setTierListCanvas
  );
  const tierListItems = useTierListStore((state) => state.tierListItems);
  const setTierListItems = useTierListStore((state) => state.setTierListItems);
  const isRowModalOpen = useTierListStore((state) => state.isRowModalOpen);
  const isDownloadModalOpen = useTierListStore(
    (state) => state.isDownloadModalOpen
  );
  const changeDownloadModalState = useTierListStore(
    (state) => state.changeDownloadModalState
  );
  const changeRowModalIndex = useTierListStore(
    (state) => state.changeRowModalIndex
  );
  const changeRowModalState = useTierListStore(
    (state) => state.changeRowModalState
  );
  const dragEnterDataTransfer = useTierListStore(
    (state) => state.dragEnterDataTransfer
  );
  const setDragEnterDataTransfer = useTierListStore(
    (state) => state.setDragEnterDataTransfer
  );
  const tierListRef = useRef<HTMLDivElement>(null);
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
      isItemSelected: dragStartRowIndex ? true : false,
      tierListNotSelectedItemIndex: wasItemNotSelected,
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
    patchTierListItems(tierListID!, updatedTierListItems);
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
      const updatedTierListItems = [
        ...tierListItemsPreviewCleared,
        { src: imageSrc },
      ];
      patchTierListItems(tierListID!, updatedTierListItems);
      patchTierList(tierListID!, tierList);
      setTierListItems(updatedTierListItems);
    } else {
      tierListItemsPreviewCleared.splice(
        dragEnterPreviewNotSelectedItemIndex,
        0,
        { src: imageSrc }
      );
      patchTierListItems(tierListID!, tierListItemsPreviewCleared);
      patchTierList(tierListID!, tierList);
      setTierListItems(tierListItemsPreviewCleared);
    }
  };

  const handleOpenModalRowManipulation = (selectedRowIndex: number) => {
    changeRowModalState(true);
    changeRowModalIndex(selectedRowIndex);
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

  const onDragEnterNotSelectedArea = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setTierList(clearItemPreviewAllRows(tierList));

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

  const retrieveItemWhenDroppingOnWrongArea = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    const isElementAbleToDrop =
      (event.nativeEvent.target as HTMLDivElement).id === "ableToDrop";

    if (!isElementAbleToDrop) {
      const imageSrc = dragEnterDataTransfer.src;

      if (dragEnterDataTransfer.isItemSelected) {
        const updatedTierList = clearItemPreviewAllRows(tierList);

        const rowIndex = Number(dragEnterDataTransfer.dragStartRowIndex);
        const itemIndex = Number(dragEnterDataTransfer.tierListItemIndex);

        updatedTierList[rowIndex].tierListSelectedItems.splice(itemIndex, 0, {
          src: imageSrc,
        });

        setTierList(updatedTierList);
      } else {
        const itemNotSelectedIndex = Number(
          dragEnterDataTransfer.tierListNotSelectedItemIndex
        );

        const updatedTierListItems = clearItemPreviewNotSelected(tierListItems);
        updatedTierListItems.splice(itemNotSelectedIndex, 0, { src: imageSrc });

        setTierListItems(updatedTierListItems);
      }
    }
  };
  const downloadTierlist = async () => {
    changeDownloadModalState(true);
    const canvas = await html2canvas(tierListRef.current as HTMLElement);
    setTierListCanvas(canvas);
  };
  return (
    <section
      className="flex flex-col gap-6 p-4"
      onDrop={retrieveItemWhenDroppingOnWrongArea}
      onDragOver={dragOverHandler}
    >
      <h1 className="text-5xl font-bold text-center my-4">~ TierList</h1>
      {isRowModalOpen && (
        <Modal>
          <ModalRowManipulation />
        </Modal>
      )}

      <div className="flex flex-col" ref={tierListRef}>
        {tierList.map((row, index) => (
          <div className="flex border-b-[3px] border-black" key={index}>
            <TierName {...row} index={index} />

            <TierListDroppablePart {...row} index={index} />
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
        id="ableToDrop"
      >
        {tierListItems.map((tierListItem, index) => {
          if (tierListItem?.opacity) {
            return (
              <img
                key={index}
                className="w-[140px] h-[120px] cursor-pointer pointer-events-none"
                src={tierListItem.src}
                style={{ opacity: tierListItem?.opacity }}
              />
            );
          } else {
            return (
              <img
                key={index}
                className="w-[140px] h-[120px] cursor-pointer"
                draggable="true"
                onDragStart={dragStartHandle}
                data-item-not-selected-index={index}
                onDragOver={dragOverHandler}
                onDrop={onDropItemNotSelectedHandle}
                onDragEnter={onDragEnterNotSelectedItem}
                src={tierListItem.src}
                id="ableToDrop"
              />
            );
          }
        })}
      </div>

      <button
        className="py-2 px-6 rounded bg-S w-[max-content] mx-auto my-4"
        onClick={downloadTierlist}
      >
        Download
      </button>

      {isDownloadModalOpen && (
        <Modal>
          <ModalDownload />
        </Modal>
      )}
    </section>
  );
};

export default TierList;
