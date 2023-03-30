import html2canvas from "html2canvas";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router";

import Modal from "../components/Modal";
import ModalDownload from "../components/ModalDownload";
import ModalRowManipulation from "../components/ModalRowManipulation";
import NotSelectedItemsContainer from "../components/NotSelectedItemsContainer";
import TierListButtons from "../components/TierListButtons";
import TierListDroppablePart from "../components/TierListDroppablePart";
import TierName from "../components/TierName";
import { getTierList } from "../fetch/getTierList";
import { clearItemPreviewAllRows } from "../utils/clearItemPreviewAllRows";
import { clearItemPreviewNotSelected } from "../utils/clearItemPreviewNotSelected";
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

  const dragEnterDataTransfer = useTierListStore(
    (state) => state.dragEnterDataTransfer
  );

  const changeDownloadModalState = useTierListStore(
    (state) => state.changeDownloadModalState
  );

  const tierListRef = useRef<HTMLDivElement>(null);

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
            <TierListButtons index={index} />
          </div>
        ))}
      </div>
      <NotSelectedItemsContainer />

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
