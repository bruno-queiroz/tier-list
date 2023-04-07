import React, { useRef, useState } from "react";

import { BiImageAdd as ImageIcon } from "react-icons/bi";
import { postTierList } from "../fetch/postTierList";
import { postImagesOnImgbb } from "../fetch/postImagesOnImgbb";

export interface TierListFormData {
  tierListName: string;
  tierList: string;
  tierListItems: { src: string }[];
  tierListImage: string;
}

const readAsDataURLAsync = (tierListItem: File) =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(tierListItem);
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
  });

const CreateTierList = () => {
  const [tierListImagePreview, setTierListImagePreview] = useState("");
  const [tierListItemsPreview, setTierListItemsPreview] = useState<string[]>(
    []
  );
  const nameInputRef = useRef<HTMLInputElement>(null);

  const tierListImage = useRef<HTMLInputElement>(null);
  const tierListItemsImages = useRef<HTMLInputElement>(null);

  const SInputRef = useRef<HTMLInputElement>(null);
  const AInputRef = useRef<HTMLInputElement>(null);
  const BInputRef = useRef<HTMLInputElement>(null);
  const CInputRef = useRef<HTMLInputElement>(null);
  const DInputRef = useRef<HTMLInputElement>(null);

  const handleTierListSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const tierListItemsArray = tierListItemsImages.current?.files;

    if (!tierListItemsArray) return;

    const imagesLinkPromise = [...tierListItemsArray].map(
      async (tierListItem) => {
        const formData = new FormData();
        formData.append("image", tierListItem);
        return { src: (await postImagesOnImgbb(formData))?.data?.url };
      }
    );

    const tierListItemsImgLinkArray = await Promise.all(imagesLinkPromise);
    const tierListImageForm = new FormData();
    tierListImageForm.append("image", tierListImage.current?.files?.[0] || "");
    const tierListImageLink = (await postImagesOnImgbb(tierListImageForm))?.data
      ?.url;
    const emptyTierList = [
      {
        color: "#FF7F7F",
        text: SInputRef.current?.value || "S",
        tierListSelectedItems: [],
      },
      {
        color: "#FFBF7F",
        text: AInputRef.current?.value || "A",

        tierListSelectedItems: [],
      },
      {
        color: "#FFDF7F",
        text: BInputRef.current?.value || "B",

        tierListSelectedItems: [],
      },
      {
        color: "#FFFF7F",
        text: CInputRef.current?.value || "C",

        tierListSelectedItems: [],
      },
      {
        color: "#BFFF7F",
        text: DInputRef.current?.value || "D",
        tierListSelectedItems: [],
      },
    ];

    const tierListFormData = {
      tierListName: nameInputRef.current?.value || "",
      tierList: JSON.stringify(emptyTierList),
      tierListItems: tierListItemsImgLinkArray,
      tierListImage: tierListImageLink,
    };
    console.log({ formData: tierListFormData });
    postTierList(tierListFormData);
  };

  const handleTierListPreviewImg = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setTierListImagePreview(reader.result as string);
    };
    if (event?.target?.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleTierListItemsPreview = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target?.files) return;
    const tierListItems = [...event.target?.files];
    tierListItems.forEach(async (item) => {
      const asyncItem = await readAsDataURLAsync(item);
      setTierListItemsPreview((prev) => [...prev, asyncItem]);
    });
  };

  return (
    <section className="p-4">
      <h1 className="text-5xl font-bold text-center my-8">
        Create a Tier List
      </h1>
      <form
        className="flex flex-col gap-6 w-[80%] mx-auto"
        onSubmit={handleTierListSubmit}
      >
        <label className="flex flex-col gap-4">
          <span className="font-medium text-xl ">Name of The Tier List</span>
          <input
            type="text"
            className="bg-primaryDarkGray p-3"
            ref={nameInputRef}
            required
          />
        </label>

        <label className="flex flex-col gap-4 relative">
          <span className="font-medium text-xl ">Tier List Image</span>

          <div className="flex gap-2 justify-center items-center bg-primaryDarkGray p-3 border-S border-dotted border-[3px] cursor-pointer">
            <ImageIcon className="text-4xl" />
            <span>Add an Image</span>
          </div>
          <div className="absolute bottom-0">
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpe"
              className="sr-only"
              ref={tierListImage}
              name="tierListImage"
              onChange={handleTierListPreviewImg}
              required
            />
          </div>
        </label>
        {tierListImagePreview && (
          <img
            src={tierListImagePreview}
            alt=""
            className="w-[140px] h-[120px] object-cover"
          />
        )}

        <label className="flex flex-col gap-4 relative">
          <span className="font-medium text-xl ">
            Set of Images to be the Tier List Items
          </span>
          <div className="absolute bottom-0">
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="sr-only"
              name="tierListItems"
              ref={tierListItemsImages}
              multiple
              required
              onChange={handleTierListItemsPreview}
            />
          </div>

          <div className="flex gap-2 justify-center items-center bg-primaryDarkGray p-3 border-A border-dotted border-[3px] cursor-pointer">
            <ImageIcon className="text-4xl" />
            <span>Add Images</span>
          </div>
        </label>
        <div className="flex flex-wrap">
          {tierListItemsPreview?.map((item, index) => (
            <img
              src={item}
              key={index}
              alt=""
              className="w-[140px] h-[120px] object-cover"
            />
          ))}
        </div>

        <label htmlFor="tier-values" className="font-medium text-xl">
          Default Tiers
        </label>

        <input
          type="text"
          placeholder="S"
          className="bg-S p-3 text-gray-900 placeholder:text-gray-900 placeholder:font-semibold"
          id="tier-values"
          ref={SInputRef}
        />
        <input
          type="text"
          placeholder="A"
          className="bg-A text-gray-900 p-3 placeholder:text-gray-900 placeholder:font-semibold"
          id="tier-values"
          ref={AInputRef}
        />
        <input
          type="text"
          placeholder="B"
          className="bg-B text-gray-900 p-3 placeholder:text-gray-900 placeholder:font-semibold"
          id="tier-values"
          ref={BInputRef}
        />
        <input
          type="text"
          placeholder="C"
          className="bg-C text-gray-900 p-3 placeholder:text-gray-900 placeholder:font-semibold"
          id="tier-values"
          ref={CInputRef}
        />
        <input
          type="text"
          placeholder="D"
          className="bg-D text-gray-900 p-3 placeholder:text-gray-900 placeholder:font-semibold"
          id="tier-values"
          ref={DInputRef}
        />

        <button className="bg-D text-gray-900  font-semibold py-3 px-4 rounded w-[max-content] mx-auto mt-4">
          Submit
        </button>
      </form>
    </section>
  );
};

export default CreateTierList;
