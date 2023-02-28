import React from "react";

const Header = () => {
  return (
    <header className="p-4 py-6 w-full bg-[#1A1A17]">
      <div className="flex items-center gap-8">
        <a href="" className="text-4xl text-[#FFBF7F] font-semibold">
          TierList Creator
        </a>

        <nav>
          <ul className="flex gap-4">
            <li>
              <a href="">Home</a>
            </li>
            <li>
              <a href="">Create Tier List</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
