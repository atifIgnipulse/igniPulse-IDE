import React, { useEffect } from "react";

const Data = ({ res }) => {


  // console.log("::::::::", Object.keys(res));
  return (
    <>
  {res.length > 0 ? (
    <div className="table-container bg-gray-40 overflow-auto max-h-[70vh] pb-5">
      <table className="border w-full">
        <thead className="sticky top-0 bg-gray-500 z-10">
          <tr>
            {Object.keys(res[0]).map((key) => (
              <th
                key={key}
                className="w-fit px-2 py-2 border-r-black border-l-black border-t-black border-2 bg-[#0072C6] text-white/90 tracking-wider"
              >
                {key.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {res.map((row, rowIndex) => (
            <tr key={rowIndex} className={`${rowIndex % 2 !== 0 ? "bg-gray-400" : ""} border w-full`}>
              {Object.keys(row).map((key) => (
                <td key={key} className="border w-fit text-start px-2">
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div></div>
  )}
</>

  );
};

export default Data;
