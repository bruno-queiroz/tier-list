import React, { useState } from "react";
import { useParams } from "react-router";
import { patchTierList } from "../fetch/patchTierList";
import { patchTierListItems } from "../fetch/patchTierListItems";
import { TierListItem as TierListItemType } from "../pages/TierList";
import { clearItemPreviewAllRows } from "../utils/clearItemPreviewAllRows";
import { clearItemPreviewSpecificRow } from "../utils/clearItemPreviewSpecificRow";
import { dragOverHandler } from "../utils/dragOverHandler";
import { useTierListStore } from "../zustandStore/store";
type TierListItemProps = TierListItemType & { index: number };

const TierListItem = ({ src, index }: TierListItemProps) => {
  const { tierListID } = useParams();
  const tierList = useTierListStore((state) => state.tierList);
  const setTierList = useTierListStore((state) => state.setTierList);
  const tierListItems = useTierListStore((state) => state.tierListItems);
  const setTierListItems = useTierListStore((state) => state.setTierListItems);
  const setDragEnterPreviewItemIndex = useTierListStore(
    (state) => state.setDragEnterPreviewItemIndex
  );

  const dragEnterDataTransfer = useTierListStore(
    (state) => state.dragEnterDataTransfer
  );
  const setDragEnterDataTransfer = useTierListStore(
    (state) => state.setDragEnterDataTransfer
  );
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
      src={src}
      id="ableToDrop"
    />
  );
};

export default TierListItem;
