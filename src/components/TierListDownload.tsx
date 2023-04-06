import html2canvas from "html2canvas";
import React from "react";
import { useTierListStore } from "../zustandStore/store";

const TierListDownload = ({
  tierListRef,
}: {
  tierListRef: React.RefObject<HTMLDivElement>;
}) => {
  const changeDownloadModalState = useTierListStore(
    (state) => state.changeDownloadModalState
  );
  const setTierListCanvas = useTierListStore(
    (state) => state.setTierListCanvas
  );
  const downloadTierlist = async () => {
    changeDownloadModalState(true);
    const canvas = await html2canvas(tierListRef.current as HTMLElement, {
      proxy: "https://tier-list-api.cyclic.app",
    });
    setTierListCanvas(canvas);
  };
  return (
    <button
      className="py-2 px-6 rounded bg-S w-[max-content] mx-auto my-4"
      onClick={downloadTierlist}
    >
      Download
    </button>
  );
};

export default TierListDownload;
