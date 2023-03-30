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
import TierListItem from "./TierListItem";
import TierListPreviewItem from "./TierListPreviewItem";
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
  const dragEnterPreviewItemIndex = useTierListStore(
    (state) => state.dragEnterPreviewItemIndex
  );
  const dragEnterDataTransfer = useTierListStore(
    (state) => state.dragEnterDataTransfer
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
          return <TierListPreviewItem key={index} {...tierListItem} />;
        } else {
          return <TierListItem key={index} {...tierListItem} index={index} />;
        }
      })}
    </div>
  );
};

export default TierListDroppablePart;
