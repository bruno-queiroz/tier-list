import React from "react";

const CreateTierList = () => {
  return (
    <section>
      <h1>Create a Tier List</h1>
      <form>
        <label>
          <span>Name of The Tier List</span>
          <input type="text" />
        </label>

        <label>
          <span>Tier List Image</span>
          <input type="image" src="" alt="" />
        </label>

        <label>
          <span>Set of Images to be the Tier List Items</span>
          <input type="image" src="" alt="" />
        </label>

        <label htmlFor="">Default Tiers</label>

        <input type="text" placeholder="S" />
        <input type="text" placeholder="A" />
        <input type="text" placeholder="B" />
        <input type="text" placeholder="C" />
        <input type="text" placeholder="D" />
      </form>
    </section>
  );
};

export default CreateTierList;
