import { AiFillSetting as SettingsIcon } from "react-icons/ai";
import {
  MdOutlineKeyboardArrowDown as ArrowDownIcon,
  MdOutlineKeyboardArrowUp as ArrowUpIcon,
} from "react-icons/md";
import { useTierListStore } from "../zustandStore/store";

const TierListButtons = ({ index }: { index: number }) => {
  const tierList = useTierListStore((state) => state.tierList);
  const setTierList = useTierListStore((state) => state.setTierList);
  const changeRowModalState = useTierListStore(
    (state) => state.changeRowModalState
  );
  const changeRowModalIndex = useTierListStore(
    (state) => state.changeRowModalIndex
  );

  const moveItemUp = (selectedItemIndex: number) => {
    if (selectedItemIndex === 0) return;
    const updatedTierList = [...tierList];
    const itemSelected = updatedTierList.slice(
      selectedItemIndex,
      selectedItemIndex + 1
    );
    const desirablePlaceItem = updatedTierList.slice(
      selectedItemIndex - 1,
      selectedItemIndex
    );

    updatedTierList.splice(selectedItemIndex - 1, 1, ...itemSelected);
    updatedTierList.splice(selectedItemIndex, 1, ...desirablePlaceItem);
    setTierList(updatedTierList);
  };
  const moveItemdown = (selectedItemIndex: number) => {
    if (tierList.length - 1 <= selectedItemIndex) return;
    const updatedTierList = [...tierList];
    const itemSelected = updatedTierList.slice(
      selectedItemIndex,
      selectedItemIndex + 1
    );

    const desirablePlaceItem = updatedTierList.slice(
      selectedItemIndex + 1,
      selectedItemIndex + 2
    );
    updatedTierList.splice(selectedItemIndex + 1, 1, ...itemSelected);
    updatedTierList.splice(selectedItemIndex, 1, ...desirablePlaceItem);
    setTierList(updatedTierList);
  };

  const handleOpenModalRowManipulation = (selectedRowIndex: number) => {
    changeRowModalState(true);
    changeRowModalIndex(selectedRowIndex);
  };

  return (
    <div className="flex items-center bg-black">
      <div className="flex items-center leading-[0] h-[120px] gap-2 text-5xl">
        <button
          className="pl-[5px]"
          data-testid={`open-row-modal-${index}`}
          onClick={() => handleOpenModalRowManipulation(index)}
        >
          <SettingsIcon />
        </button>
        <div className="flex flex-col">
          <button onClick={() => moveItemUp(index)}>
            <ArrowUpIcon />
          </button>
          <button onClick={() => moveItemdown(index)}>
            <ArrowDownIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TierListButtons;
