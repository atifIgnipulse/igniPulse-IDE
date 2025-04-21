import { Copy, ClipboardCheck, Moon } from "lucide-react";
import React from "react";

function LeftMenu({handleCopy, handlePaste}) {
  return (
    <>
    <div className="border-2 border-sky-700 w-16 h-full rounded-lg overflow-hidden">
      <div className="h-[80%] w-full flex flex-col items-center justify-start py-2 gap-y-3">
        <div className="h-[16%] w-[80%] flex flex-col items-center justify-center gap-y-1 cursor-pointer">
          <div className="flex items-center justify-center p-3.5 flex-col gap-x-2 transition-all duration-300 bg-[#2E60EB] hover:bg-[#3d6df1] rounded-full ">
            <Copy onClick={handleCopy} className="text-white" size={16} />
          </div>
          <p className="text-black text-sm font-thin select-none">Copy</p>
        </div>
        <div className="h-[16%] w-[80%] flex flex-col items-center justify-center gap-y-1 cursor-pointer">
          <div className="flex items-center justify-center p-3.5 flex-col gap-x-2 transition-all duration-300 bg-[#2E60EB] hover:bg-[#3d6df1] rounded-full ">
            <ClipboardCheck onClick={handlePaste} className="text-white" size={18} />
          </div>
          <p className="text-black text-sm font-thin select-none">Paste</p>
        </div>
      </div>
      <div className="h-[20%] w-full flex items-end justify-center py-3 ">
        <div className="flex items-center justify-center p-3.5 flex-col gap-x-2 transition-all duration-300 bg-[#2E60EB] hover:bg-[#3d6df1] rounded-full cursor-pointer">
          <Moon className="text-white " size={16} />
        </div>
      </div>
    </div>
    
    </>
  );
}

export default LeftMenu;
