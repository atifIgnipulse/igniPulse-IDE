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
  <div className="w-[95%] h-full py-3 px-2">
    <p className='text-[#323A47] rounded py-2 tracking-wider text-lg font-bold text-center w-full bg-white mb-3'>DB Details</p>
    <>
    {details.map((detail, index) => (
      <div key={index} className='flex flex-col items-end'>
        <div
          className="w-full flex items-center justify-start cursor-pointer select-none gap-x-2"
          onClick={() => toggleVisibility(index)}
        >
          {visibleRows[index] ? <Minus size={18} className='text-white'/> : <Plus className='text-white size-4'/>}
          <p className='text-md text-white tracking-widest font-bold underline w-full'>{detail.table}</p>
        </div>

        {visibleRows[index] &&
          detail.columns.map((col, colIndex) => (
            <div key={colIndex} className="border-s-2 w-[90%] py-[.2rem] text-sm tracking-wide gap-x-1 flex items-center justify-start text-white before:bg-red-500 before:w-5 before:border">
              <div className='underline tracking-wider'>{col.column}</div>
              <div className='tracking-wider'>{`(${col.type})`}</div>
            </div>
          ))}
      </div>
    ))}
    </>
  </div>
);

}

export default TableDetail