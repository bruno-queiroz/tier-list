import React, { useState } from "react";
import { useParams } from "react-router";
import { patchTierList } from "../fetch/patchTierList";
import { patchTierListItems } from "../fetch/patchTierListItems";
import { TierList } from "../pages/TierList";
import { clearItemPreviewAllRows } from "../utils/clearItemPreviewAllRows";
import { clearItemPreviewNotSelected } from "../utils/clearItemPreviewNotSelected";
import { clearItemPreviewSpecificRow } from "../utils/clearItemPreviewSpecificRow";
import { dragOverHandler } from "../utils/dragOverHandler";
import { useTierListStore } from "../zustandStore/store";
type TierListDroppablePartProps = TierList & { index: number };

const TierListDroppablePart = ({
  tierListSelectedItems,
  index,
}: TierListDroppablePartProps) => {
  const { tierListID } = useParams();
  const tierList = useTierListStore((state) => state.tierList);
  const setTierList = useTierListStore((state) => state.setTierList);
  const tierListItems = useTierListStore((state) => state.tierListItems);
  const setTierListItems = useTierListStore((state) => state.setTierListItems);
  const [dragEnterPreviewItemIndex, setDragEnterPreviewItemIndex] = useState(0);
  const dragEnterDataTransfer = useTierListStore(
    (state) => state.dragEnterDataTransfer
  );
  const setDragEnterDataTransfer = useTierListStore(
    (state) => state.setDragEnterDataTransfer
  );

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
      patchTierListItems(tierListID!, updatedTierListItems);
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
    const clearedTierList = clearItemPreviewSpecificRow(
      droppedRowIndex,
      updatedTierList
    );

    patchTierList(tierListID!, clearedTierList);

    setTierList(clearedTierList);
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
    const clearedTierList = clearItemPreviewSpecificRow(
      enterItemRowIndex,
      tierList
    );
    setTierList(clearedTierList);

    const tierListPreviewCleared = clearItemPreviewAllRows(updatedTierList);

    tierListPreviewCleared[enterItemRowIndex].tierListSelectedItems.splice(
      enterItemIndex,
      0,
      {
        src: dragEnterDataTransfer.src,
        opacity: "0.5",
      }
    );
    setTierList(tierListPreviewCleared);
  };

  const onDragEnterARow = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setTierListItems(clearItemPreviewNotSelected(tierListItems));

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
    const clearedTierList = clearItemPreviewSpecificRow(
      leaveRowIndex,
      tierList
    );
    setTierList(clearedTierList);
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
      patchTierListItems(tierListID!, updatedTierListItems);
      setTierListItems(updatedTierListItems);
    }

    updatedTierList[droppedRowIndex].tierListSelectedItems.splice(
      itemDroppedIndex,
      0,
      { src: imageSrc }
    );
    patchTierList(tierListID!, updatedTierList);
    setTierList(updatedTierList);
  };

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

  return (
    <div
      className="flex flex-wrap bg-[#1A1A17] flex-1"
      onDragOver={dragOverHandler}
      onDrop={onDropHandler}
      onDragEnter={onDragEnterARow}
      onDragLeave={onDragLeaveARow}
      data-row-index={index}
      id="ableToDrop"
    >
      {tierListSelectedItems.map((tierListItem, index) => {
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
              data-tierlist-item-index={index}
              onDragOver={dragOverHandler}
              onDrop={onDropItemHandler}
              onDragEnter={onDragEnterSelectedItemPreview}
              src={tierListItem.src}
              id="ableToDrop"
            />
          );
        }
      })}
    </div>
  );
};

export default TierListDroppablePart;
