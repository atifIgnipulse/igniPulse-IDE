import React, { useEffect } from "react";

const Data = ({ res }) => {
  // console.log("::::::::", Object.keys(res));
  return (
    <>
      {res.length > 0 ? (
        <div className="table-container bg-gray-50  rounded-lg shadow-md">
          <table className="w-full border-collapse">
            {/* Table Header */}
            <thead className="sticky top-0 bg-[#0072C6] text-white z-10">
              <tr>
                {Object.keys(res[0]).map((key) => (
                  <th
                    key={key}
                    className="px-4 py-3 border-2 border-[#005a9e] text-white tracking-wider text-left uppercase"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {res.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`transition duration-200 ${
                    rowIndex % 2 === 0 ? "bg-white" : "bg-gray-200"
                  } hover:bg-gray-300`}
                >
                  {Object.keys(row).map((key) => (
                    <td
                      key={key}
                      className="border-2 border-gray-300 px-4 py-2 text-start text-gray-800"
                    >
                      {row[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">No data available.</div>
      )}
    </>
  );
};

export default Data;
