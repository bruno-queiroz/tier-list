import React, { useState } from "react";
import { patchTierListItems } from "../fetch/patchTierListItems";
import { useTierListStore } from "../zustandStore/store";
import { useParams } from "react-router";
import { patchTierList } from "../fetch/patchTierList";
import { clearItemPreviewAllRows } from "../utils/clearItemPreviewAllRows";
import { dragOverHandler } from "../utils/dragOverHandler";
import { clearItemPreviewNotSelected } from "../utils/clearItemPreviewNotSelected";
import TierListPreviewItem from "./TierListPreviewItem";

const NotSelectedItemsContainer = () => {
  const { tierListID } = useParams();
  const tierList = useTierListStore((state) => state.tierList);
  const tierListItems = useTierListStore((state) => state.tierListItems);
  const setTierList = useTierListStore((state) => state.setTierList);
  const setTierListItems = useTierListStore((state) => state.setTierListItems);
  const dragEnterDataTransfer = useTierListStore(
    (state) => state.dragEnterDataTransfer
  );
  const setDragEnterDataTransfer = useTierListStore(
    (state) => state.setDragEnterDataTransfer
  );
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
  );
};

export default NotSelectedItemsContainer;
