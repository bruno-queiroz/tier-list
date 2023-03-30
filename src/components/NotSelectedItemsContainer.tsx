import React, { useState } from "react";
import { patchTierListItems } from "../fetch/patchTierListItems";
import { useTierListStore } from "../zustandStore/store";
import { useParams } from "react-router";
import { patchTierList } from "../fetch/patchTierList";
import { clearItemPreviewAllRows } from "../utils/clearItemPreviewAllRows";
import { dragOverHandler } from "../utils/dragOverHandler";
import { clearItemPreviewNotSelected } from "../utils/clearItemPreviewNotSelected";
import TierListPreviewItem from "./TierListPreviewItem";
import TierListItemNotSelected from "./TierListItemNotSelected";

const NotSelectedItemsContainer = () => {
  const { tierListID } = useParams();
  const tierList = useTierListStore((state) => state.tierList);
  const tierListItems = useTierListStore((state) => state.tierListItems);
  const setTierList = useTierListStore((state) => state.setTierList);
  const setTierListItems = useTierListStore((state) => state.setTierListItems);
  const dragEnterDataTransfer = useTierListStore(
    (state) => state.dragEnterDataTransfer
  );
  const [
    dragEnterPreviewNotSelectedItemIndex,
    setDragEnterPreviewNotSelectedItemIndex,
  ] = useState(-1);

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

  return (
    <div
      className="flex flex-wrap w-full min-h-[135px] p-2 bg-gray-800"
      onDrop={onDropItemsNotSelectedHandle}
      onDragOver={dragOverHandler}
      onDragEnter={onDragEnterNotSelectedArea}
      id="ableToDrop"
    >
      {tierListItems.map((tierListItem, index) => {
        if (tierListItem?.opacity) {
          return <TierListPreviewItem {...tierListItem} key={index} />;
        } else {
          return (
            <TierListItemNotSelected
              {...tierListItem}
              index={index}
              setDragItemIndex={setDragEnterPreviewNotSelectedItemIndex}
            />
          );
        }
      })}
    </div>
  );
};

export default NotSelectedItemsContainer;
