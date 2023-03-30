import React, { useState } from "react";
import { useParams } from "react-router";
import { patchTierListItems } from "../fetch/patchTierListItems";
import { TierListItem as TierListItemType } from "../pages/TierList";
import { clearItemPreviewNotSelected } from "../utils/clearItemPreviewNotSelected";
import { dragOverHandler } from "../utils/dragOverHandler";
import { useTierListStore } from "../zustandStore/store";
type TierListItemNotSelectedProps = TierListItemType & {
  index: number;
  setDragItemIndex: React.Dispatch<React.SetStateAction<number>>;
};

const TierListItemNotSelected = ({
  src,
  index,
  setDragItemIndex,
}: TierListItemNotSelectedProps) => {
  const { tierListID } = useParams();
  const tierList = useTierListStore((state) => state.tierList);
  const setTierList = useTierListStore((state) => state.setTierList);
  const tierListItems = useTierListStore((state) => state.tierListItems);
  const setTierListItems = useTierListStore((state) => state.setTierListItems);

  const dragEnterDataTransfer = useTierListStore(
    (state) => state.dragEnterDataTransfer
  );
  const setDragEnterDataTransfer = useTierListStore(
    (state) => state.setDragEnterDataTransfer
  );
  const onDragEnterNotSelectedItem = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();

    const imageSrc = dragEnterDataTransfer.src;
    const tierListItemNotSelectedIndex = (
      event.nativeEvent.target as HTMLDivElement
    ).dataset?.itemNotSelectedIndex;

    if (!tierListItemNotSelectedIndex) return;
    setDragItemIndex(Number(tierListItemNotSelectedIndex));

    const updatedTierListItems = clearItemPreviewNotSelected(tierListItems);

    updatedTierListItems.splice(Number(tierListItemNotSelectedIndex), 0, {
      src: imageSrc,
      opacity: "0.5",
    });

    setTierListItems(updatedTierListItems);
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
      src={src}
      id="ableToDrop"
    />
  );
};

export default TierListItemNotSelected;
