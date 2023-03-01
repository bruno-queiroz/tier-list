import React from "react";

import { BiImageAdd as ImageIcon } from "react-icons/bi";

const CreateTierList = () => {
  return (
    <section className="p-4">
      <h1 className="text-5xl font-bold text-center my-8">
        Create a Tier List
      </h1>
      <form className="flex flex-col gap-6 w-[80%] mx-auto">
        <label className="flex flex-col gap-4">
          <span className="font-medium text-xl ">Name of The Tier List</span>
          <input type="text" className="bg-gray-800 p-3" />
        </label>

        <label className="flex flex-col gap-4">
          <span className="font-medium text-xl ">Tier List Image</span>
          <input
            type="file"
            accept="image/png, image/jpeg"
            className="sr-only"
          />
          <div className="flex gap-2 justify-center items-center bg-gray-800 p-3 border-S border-dotted border-[3px] cursor-pointer">
            <ImageIcon className="text-4xl" />
            <span>Add an Image</span>
          </div>
        </label>

        <label className="flex flex-col gap-4">
          <span className="font-medium text-xl ">
            Set of Images to be the Tier List Items
          </span>
          <input
            type="file"
            accept="image/png, image/jpeg"
            className="sr-only"
          />
          <div className="flex gap-2 justify-center items-center bg-gray-800 p-3 border-A border-dotted border-[3px] cursor-pointer">
            <ImageIcon className="text-4xl" />
            <span>Add Images</span>
          </div>
        </label>

        <label htmlFor="tier-values" className="font-medium text-xl">
          Default Tiers
        </label>

        <input
          type="text"
          placeholder="S"
          className="bg-S p-3 text-gray-900 placeholder:text-gray-900 placeholder:font-semibold"
          id="tier-values"
        />
        <input
          type="text"
          placeholder="A"
          className="bg-A text-gray-900 p-3 placeholder:text-gray-900 placeholder:font-semibold"
          id="tier-values"
        />
        <input
          type="text"
          placeholder="B"
          className="bg-B text-gray-900 p-3 placeholder:text-gray-900 placeholder:font-semibold"
          id="tier-values"
        />
        <input
          type="text"
          placeholder="C"
          className="bg-C text-gray-900 p-3 placeholder:text-gray-900 placeholder:font-semibold"
          id="tier-values"
        />
        <input
          type="text"
          placeholder="D"
          className="bg-D text-gray-900 p-3 placeholder:text-gray-900 placeholder:font-semibold"
          id="tier-values"
        />

        <button className="bg-D text-gray-900  font-semibold py-3 px-4 rounded w-[max-content] mx-auto mt-4">
          Submit
        </button>
      </form>
    </section>
  );
};

export default CreateTierList;
