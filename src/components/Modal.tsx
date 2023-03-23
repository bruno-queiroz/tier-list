import React from "react";

const Modal = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50">
      <div className="bg-[#1A1A17] rounded p-4 max-w-[800px] w-full mt-8 h-[max-content]">
        {children}
      </div>
    </div>
  );
};

export default Modal;
