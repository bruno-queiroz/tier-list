import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="p-4 py-6 w-full bg-lightGray">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-4xl text-D font-semibold">
          TierList Creator
        </Link>

        <nav>
          <ul className="flex gap-4">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/create-tier-list">Create Tier List</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
