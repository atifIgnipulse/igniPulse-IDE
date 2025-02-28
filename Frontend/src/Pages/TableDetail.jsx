import { Minus, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function TableDetail({details}) {

  const [visibleRows, setVisibleRows] = useState({});

  useEffect(()=>{
  }, [details])
  

const toggleVisibility = (index) => {
  setVisibleRows((prev) => ({
    ...prev,
    [index]: !prev[index],
  }));
};

return (
  <div className="w-[95%] h-full py-2">
  {/* Header */}
  <p className="text-[#1E293B] rounded-lg py-3 text-md font-bold text-center w-full bg-white shadow-md tracking-widest mb-4">
    Available Tables
  </p>

  {/* Table List */}
  {details.map((detail, index) => (
    <div key={index} className="flex flex-col items-end w-full my-2">
      {/* Table Name */}
      <div
        className="w-full flex items-center gap-x-2 cursor-pointer select-none py-2 px-3 rounded-md bg-[#1E293B] hover:bg-[#253041] transition duration-200"
        onClick={() => toggleVisibility(index)}
      >
        {visibleRows[index] ? (
          <Minus size={18} className="text-[#7FBA00]" />
        ) : (
          <Plus size={18} className="text-[#7FBA00]" />
        )}
        <p className="text-md text-white tracking-widest font-bold underline">
          {detail.table}
        </p>
      </div>

      {/* Column Details */}
      {visibleRows[index] &&
        detail.columns.map((col, colIndex) => (
          <div
            key={colIndex}
            className="w-[90%] flex items-center gap-x-3 pl-6 py-2 border-l-4 border-[#7FBA00] bg-[#253041] text-white text-sm tracking-wide rounded-r-md mt-1"
          >
            <span className="font-semibold">{col.column}</span>
            <span className="text-gray-400">{`(${col.type})`}</span>
          </div>
        ))}
    </div>
  ))}
</div>

);

}

export default TableDetail