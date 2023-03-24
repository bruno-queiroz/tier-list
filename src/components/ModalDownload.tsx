import React, { useEffect, useRef } from "react";
import { useTierListStore } from "../zustandStore/store";
import { IoClose as CloseIcon } from "react-icons/io5";

const ModalDownload = () => {
  const tierListCanvas = useTierListStore((state) => state.tierListCanvas);
  const changeDownloadModalState = useTierListStore(
    (state) => state.changeDownloadModalState
  );

  return (
    <section className="flex flex-col items-center gap-4 p-4 relative">
      <a
        href={tierListCanvas?.toDataURL()}
        download
        className="w-[max-content] py-2 px-12 bg-D font-semibold text-lg text-primaryDarkGray"
      >
        Download Image
      </a>
      <button
        className="text-4xl font-semibold text-white absolute top-0 right-0"
        onClick={() => changeDownloadModalState(false)}
      >
        <CloseIcon />
      </button>
      <div>
        <img src={tierListCanvas?.toDataURL()} alt="" />
      </div>
    </section>
  );
};

export default ModalDownload;
