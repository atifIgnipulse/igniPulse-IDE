import { React, useState, useRef, useEffect } from "react";
import { Database, Eraser, File, Play, Save } from "lucide-react";
import { io } from "socket.io-client";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import Config from "../../Config/config";
import toast, { Toaster } from "react-hot-toast";
import Data from "./Data";

import TableLayout from "./TableLayout";
import DatabaseLayout from "./DatabaseLayout";
import TableDetail from "./TableDetail";

function sqlIDETwo() {
  const [outputHeight, setOutputHeight] = useState(20);
  const [isDragging, setIsDragging] = useState(false);
  const dataRef = useRef(null);

  const textAreaRef = useRef(null);
  const [editorContent, setEditorContent] = useState("");
  const [resDB, setResDb] = useState([]);
  const [dataBases, setDataBases] = useState([]);

  const [tabIsOpen, setTabIsOpen] = useState(false);

  const [db, setDb] = useState(() => window.localStorage.getItem("unique_id") || "");
  const [details, setDetails] = useState([])

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  

  const handleMouseMoveVertical = (e) => {
    if (isDragging) {
      const newHeight =
        ((window.innerHeight - e.clientY) / window.innerHeight) * 100;
      if (newHeight > 10 && newHeight < 80) {
        // Set limits for resizing
        setOutputHeight(newHeight);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getTables = () => {
    // console.log(db);
    Config.getTables(db)
      .then((res) => {
        // console.log(res.data)
        const detail_data = Object.values(res.data.reduce((acc, row)=>{
          if (!acc[row.TABLE_NAME]) {
            acc[row.TABLE_NAME] = { table: row.TABLE_NAME, columns: [] };
          }
          
          acc[row.TABLE_NAME].columns.push({column: row.COLUMN_NAME, type: row.DATA_TYPE })
          return acc;
        }, {}))
        // console.log("dasdas",detail_data)
        setDetails(detail_data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const getDataBases = () => {
  //   Config.getDataBases()
  //     .then((res) => {
  //       // console.log(res.data)
  //       setDataBases([...res.data]);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const handleRun = () => {
    // console.log("first");

    Config.postData(editorContent, db)
      .then((res) => {
        if (res.data.success) {
          toast.success("success");
          setResDb(res.data.result);
          // getDataBases();
        } else {
          setResDb([]);
          toast(res.data.sqlMessage);
          // console.log(res.data);
        }
      })
      .catch((err) => {
        toast.error(err.message || "An unexpected error occurred");
        setResDb([]);
      });
  };

  const createDB = ()=>{
    const inq_id = window.localStorage.unique_id;
    Config.createDB(inq_id).then(res=>{
      if(res.status === 200){
        const unique_id = res.data;
        window.localStorage.setItem("unique_id", unique_id);
        setDb(unique_id)
      }
    }).catch(err=>{
      console.log(err)
    })
  }


  useEffect(() => {
    createDB();
    // getDataBases();
    getTables();
  }, []);

  useEffect(() => {
    if (dataRef.current) {
      dataRef.current.scrollTop = 0;
    } 
  }, [resDB]);

  const handleDownload = async () => {
    if (window.showSaveFilePicker) {
      const fileHandler = await window.showSaveFilePicker({
        suggestedName: "code.sql",
        types: [
          {
            accept: { "text/plain": [".sql"] },
          },
        ],
      });

      const writeAbleStream = await fileHandler.createWritable();
      await writeAbleStream.write(editorContent);
      await writeAbleStream.close();
    } else {
      const element = document.createElement("a");
      const file = new Blob(
        [editorContent || ""],
        {
          type: "text/plain",
        }
      );
      element.href = URL.createObjectURL(file);
      // element.download = `code.sql`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const openFile = async () => {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          accept: {
            "text/plain": [".txt", ".sql"],
          },
        },
      ],
      multiple: false,
    });

    const file = await fileHandle.getFile();
    const fileContent = await file.text();
    setEditorContent(fileContent);
  };

  return (
    <>
      <div className="flex flex-col h-screen w-screen overflow-hidden">
        <div className="flex h-[8%] w-full">
          <div className=" w-1/2 flex items-center ps-16 gap-x-2">
            <button
              className="text-sm font-semibold flex items-center justify-between gap-x-4 bg-[#374151] px-2 py-2 rounded hover:bg-[#323a47] text-zinc-50 tracking-wider cursor-pointer"
              onClick={() => setEditorContent("")}
            >
              Clear <Eraser size="18" />
            </button>
            {/* <DatabaseLayout dataBases={dataBases} getTables={getTables} /> */}
            <div>Your Database: <strong>{db}</strong></div>
            {/* <TableLayout tables={tables} /> */}
          </div>
          <div className="h-full grid place-items-center">
            <button
              className="text-sm bg-[#7FBA00] font-semibold flex items-center justify-between gap-x-2 py-2 px-2 rounded hover:bg-[#86b228] text-zinc-900 tracking-wider cursor-pointer"
              onClick={handleRun}
            >
              Execute <Play size="18" />
            </button>
          </div>
          <div className="w-1/2 px-8 gap-x-2 flex items-center justify-end">
            <button
              className="text-sm font-semibold flex items-center justify-between gap-x-4 bg-[#2677C7] py-2 px-2 rounded hover:bg-[#0072C6] text-zinc-50 tracking-wider cursor-pointer"
              onClick={openFile}
            >
              Open Script <File size="18" />
            </button>
            <button
              className="text-sm font-semibold flex items-center justify-between gap-x-4 bg-[#374151] py-2 px-2 rounded hover:bg-[#323a47] text-zinc-50 tracking-wider cursor-pointer"
              onClick={handleDownload}
            >
              Save Script <Save size="18" />
            </button>
          </div>
        </div>

        <div className="main w-full h-[90%] flex overflow-hidden">
          <div className="bg-[#323A47] w-2/11 h-full flex items-center justify-center overflow-scroll">
            <TableDetail details={details}/>
          </div>
          <div className=" w-9/11 h-full">
            <div className="h-1/5 w-full">
              <div
                className="flex-grow"
                style={{
                  maxHeight: "95%",
                  overflowY: "scroll",
                }}
              >
                <CodeMirror
                  value={editorContent}
                  className="w-full border text-[1rem]"
                  // extensions={[sql()]}
                  onChange={(newContent) => setEditorContent(newContent)}
                  options={{
                    lineNumbers: true,
                  }}
                />
              </div>
            </div>
            <div className="w-full  h-[5%]">
              {resDB.length > 0 && (
                <div className="w-fit gap-x-5">
                  Total records: <strong>{resDB.length}</strong>
                </div>
              )}
            </div>
            <div className="w-full h-5/7">
              <div
                className="overflow-auto w-full bottom-0"
                ref={dataRef}
                style={{ height: "calc(70vh)" }}
              >
                {resDB.length > 0 && <Data res={resDB} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          success: {
            duration: 3000,
            iconTheme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </>
  );
}

export default sqlIDETwo;
