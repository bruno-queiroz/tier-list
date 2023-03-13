import React, { useState } from "react";
import { TierList } from "../pages/TierList";
import { useTierListStore } from "../zustandStore/store";
import { IoClose as CloseIcon } from "react-icons/io5";

const colorOptions = [
  {
    color: "#FF7F7F",
    colorName: "red",
  },
  {
    color: "#FFBF7F",
    colorName: "orange",
  },
  {
    color: "#FFDF7F",
    colorName: "orangeYellow",
  },
  {
    color: "#FFFF7F",
    colorName: "yellow",
  },
  {
    color: "#BFFF7F",
    colorName: "lightGreen",
  },
  {
    color: "#7FFF7F",
    colorName: "green",
  },
  {
    color: "#7FFFFF",
    colorName: "lightBlue",
  },

  {
    color: "#7FBFFF",
    colorName: "blue",
  },
  {
    color: "#7F7FFF",
    colorName: "purple",
  },
  {
    color: "#FF7FFF",
    colorName: "pink",
  },
  {
    color: "#BF7FBF",
    colorName: "pinkGray",
  },
  {
    color: "#3B3B3B",
    colorName: "gray",
  },
  {
    color: "#858585",
    colorName: "lightGray",
  },
  {
    color: "#CFCFCF",
    colorName: "veryLightGray",
  },
  {
    color: "#F7F7F7",
    colorName: "darkWhite",
  },
];

const ModalRowManipulation = () => {
  const tierList = useTierListStore((state) => state.tierList);
  const tierListItems = useTierListStore((state) => state.tierListItems);
  const setTierList = useTierListStore((state) => state.setTierList);
  const setTierListItems = useTierListStore((state) => state.setTierListItems);
  const changeModalRowState = useTierListStore(
    (state) => state.changeRowModalState
  );
  const rowModalIndex = useTierListStore((state) => state.rowModalIndex);
  const [textAreaValue, setTextAreaValue] = useState(
    tierList[rowModalIndex]?.text
  );

  // need IDs
  const addRowAbove = () => {
    const tierListClone = [...tierList];
    tierListClone.splice(rowModalIndex, 0, {
      text: "New",
      color: "#FFFF7F",
      tierListSelectedItems: [],
    });
    setTierList(tierListClone);
  };

  const addRowBelow = () => {
    const tierListClone = [...tierList];
    tierListClone.splice(rowModalIndex + 1, 0, {
      text: "New",
      color: "#FFFF7F",
      tierListSelectedItems: [],
    });
    setTierList(tierListClone);
  };

  const deleteRow = () => {
    const updatedTierList = tierList.filter(
      (_, index) => index !== rowModalIndex
    );
    setTierList(updatedTierList);
    changeModalRowState(false);
  };

  const clearRowImages = () => {
    const updatedTierList = [...tierList];
    setTierListItems([
      ...tierListItems,
      ...updatedTierList[rowModalIndex].tierListSelectedItems,
    ]);
    updatedTierList[rowModalIndex].tierListSelectedItems = [];
    setTierList(updatedTierList);
  };

  const editItemtext = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedTierList = [...tierList];
    updatedTierList[rowModalIndex].text = event.target.value;

    setTextAreaValue(event.target.value);
    setTierList(updatedTierList);
  };

  // const test = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
  //   console.log(e.currentTarget.checked);
  // };
  return (
    <section className="flex flex-col gap-8 py-8 relative">
      <button
        type="button"
        aria-label="close modal"
        className="absolute top-1 right-1 text-2xl"
        onClick={() => changeModalRowState(false)}
      >
        <CloseIcon />
      </button>
      <fieldset>
        <legend className="text-2xl font-semibold text-center mb-6">
          Choose a Label Background Color
        </legend>
        <div className="flex gap-2 justify-center flex-wrap">
          {colorOptions?.map((color, index) => (
            <label className="">
              <input
                type="radio"
                className="sr-only"
                name="background-color"
                aria-label={color.colorName}
                key={index}
              />
              <div
                className="w-[40px] h-[40px] rounded-[50%] focus:border-white focus:border-[2px]"
                style={{ backgroundColor: color.color }}
              ></div>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex flex-col">
        <span className="text-2xl font-semibold text-center mb-6">
          Edit Label Text Below
        </span>
        <textarea
          className="bg-[#2D2D28] indent-1"
          value={textAreaValue}
          onChange={(e) => editItemtext(e)}
        ></textarea>
      </label>
      <div className="grid grid-cols-2 gap-4 text-primaryDarkGray font-semibold">
        <button className="py-4 rounded bg-S" onClick={deleteRow}>
          Delete This Row
        </button>
        <button className="py-4 rounded bg-A" onClick={clearRowImages}>
          Clear This Row Images
        </button>
        <button className="py-4 rounded bg-C" onClick={addRowAbove}>
          Add a Row Above
        </button>
        <button className="py-4 rounded bg-D" onClick={addRowBelow}>
          Add a Row Below
        </button>
      </div>
    </section>
  );
};

export default ModalRowManipulation;
