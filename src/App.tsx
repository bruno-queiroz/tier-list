import React from "react";
import { Route, Routes } from "react-router";
import Header from "./components/Header";
import CreateTierList from "./pages/CreateTierList";
import Home from "./pages/Home";

const App = () => {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-tier-list" element={<CreateTierList />} />
      </Routes>
    </>
  );
};

export default App;
