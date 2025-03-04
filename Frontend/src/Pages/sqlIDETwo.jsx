import { React, useState, useRef, useEffect } from "react";
import { Database, Eraser, File, Play, Save } from "lucide-react";
import { io } from "socket.io-client";
import CodeMirror from "@uiw/react-codemirror";
import {EditorView} from "@codemirror/view";
import { sql } from "@codemirror/lang-sql";
import Config from "../../Config/config";
import toast, { Toaster } from "react-hot-toast";
import Data from "./Data";

import TableLayout from "./TableLayout";
import DatabaseLayout from "./DatabaseLayout";
import TableDetail from "./TableDetail";

function sqlIDETwo() {
  const dataRef = useRef(null);
  const editorRef = useRef(null);
  const [editorContent, setEditorContent] = useState("");
  const [resDB, setResDb] = useState([]);
  const [db, setDb] = useState(
    () => window.localStorage.getItem("unique_id") || ""
  );
  const [details, setDetails] = useState([]);


  const customScrollbar = EditorView.theme({
    ".cm-scroller": { 
      scrollbarWidth: "thin", // For Firefox
    },
    "::-webkit-scrollbar": {
      width: "8px",  // Scrollbar width
      height: "8px", // Horizontal scrollbar height
    },
    "::-webkit-scrollbar-track": {
      background: "#1E1E1E", // Track color
      borderRadius: "5px",
    },
    "::-webkit-scrollbar-thumb": {
      background: "#007AFF", // Thumb color
      borderRadius: "5px",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#005BBB", // Thumb hover effect
    }
  });
  
  const fullHeightEditor = EditorView.theme({
    ".cm-scroller": { 
      maxHeight: "14rem !important",  // Fixed height for scrolling
      overflow: "auto !important", // Ensure scrollbars appear when needed
    },
    ".cm-content": { 
      minHeight: "14rem !important",  // Prevents extra height
      whiteSpace: "pre",  // Prevents text wrapping
    },
    ".cm-gutter": { 
      minHeight: "14rem !important",  // Aligns with `.cm-content`
      
    },
  });
  

  const getTables = () => {
    // console.log(db);
    Config.getTables(db)
      .then((res) => {
        // console.log(res.data)
        const detail_data = Object.values(
          res.data.reduce((acc, row) => {
            if (!acc[row.TABLE_NAME]) {
              acc[row.TABLE_NAME] = { table: row.TABLE_NAME, columns: [] };
            }

            acc[row.TABLE_NAME].columns.push({
              column: row.COLUMN_NAME,
              type: row.DATA_TYPE,
            });
            return acc;
          }, {})
        );
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
    if (editorContent != "") {
      Config.postData(editorContent, db)
        .then((res) => {
          if (res.data.success) {
            toast.success("success");
            setResDb(res.data.result);
            getTables();
          } else {
            setResDb([]);
            if (res.data.code == "ER_NO_SUCH_TABLE") {
              const cleanedMessage = res.data.sqlMessage.replace(
                /'[^.]+\.([^']+)'/,
                "'$1'"
              );
              toast.error(cleanedMessage);
            } else {
              toast.error(res.data.sqlMessage);
            }
          }
        })
        .catch((err) => {
          toast.error(err.message || "An unexpected error occurred");
          setResDb([]);
        });
    }
  };

  const createDB = () => {
    const inq_id = window.localStorage.unique_id;
    Config.createDB(inq_id)
      .then((res) => {
        if (res.status === 200) {
          const unique_id = res.data;
          if(unique_id != inq_id){
            window.localStorage.removeItem("unique_id");
            window.localStorage.setItem("unique_id", unique_id);
            setDb(unique_id);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
      const file = new Blob([editorContent || ""], {
        type: "text/plain",
      });
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

  const handleClear = ()=>{
    if(editorContent){
      setEditorContent("")
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }
  }

  return (
    <div className="flex h-screen w-screen bg-white text-black">
    <div className="w-2/11 h-full flex items-center justify-center overflow-auto bg-black/10 px-2">
      <TableDetail details={details} />
    </div>
  
    <div className="flex flex-col items-end w-full h-full overflow-hidden">
      {/* Top Controls */}
      <div className="flex h-[8%] w-full px-3 items-center justify-between shadow-md bg-gray-100">
        {/* Left Side Controls */}
        <div className="flex items-center gap-x-3">
          <button
            className="cursor-pointer flex items-center gap-x-2 bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600 text-white text-xs font-semibold tracking-wide transition"
            onClick={handleClear}
          >
            <Eraser size="18" /> Clear
          </button>
          <button
            className="cursor-pointer flex items-center gap-x-2 bg-green-600 px-3 py-2 rounded-lg hover:bg-ggreen-700 text-white text-xs font-semibold tracking-wide transition"
            onClick={handleRun}
          >
            <Play size="18" /> Execute
          </button>
        </div>
  
        {/* Right Side Controls */}
        <div className="flex items-center gap-x-3">
          <button
            className="cursor-pointer flex items-center gap-x-2 bg-blue-700 px-3 py-2 rounded-lg hover:bg-blue-800 text-white text-xs font-semibold tracking-wide transition"
            onClick={openFile}
          >
            <File size="18" /> Open Script
          </button>
          <button
            className="cursor-pointer flex items-center gap-x-2 bg-blue-700 px-3 py-2 rounded-lg hover:bg-blue-800 text-white text-xs font-semibold tracking-wide transition"
            onClick={handleDownload}
          >
            <Save size="18" /> Save Script
          </button>
        </div>
      </div>
  
      {/* Main Content */}
      <div className="flex w-full h-[92%] overflow-hidden">
        <div className="w-full h-full flex flex-col ">
          {/* Code Editor Section */}
            {/* <div className="h-1/3 w-full overflow-auto shadow-lg border border-gray-300 rounded-lg bg-gray-100 scrollbar-custom"> */}
              <CodeMirror
                value={editorContent}
                className="w-full h-2/6 text-[1rem] scrollbar-custom border  border-gray-300 rounded-xl shadow-md overflow-hidden"
                onChange={(newContent) => setEditorContent(newContent)}
                theme="light"
                // height="100%"
                extensions={[fullHeightEditor, customScrollbar]}
                options={{
                  lineNumbers: true,
                }}
                onCreateEditor={(editor) => {
                  editorRef.current = editor;
                }}
              />
            {/* </div> */}
  
          {/* Records Count */}
          {/* <div className="w-full h-[5%] px-4 flex items-center text-black">
            {resDB.length > 0 && (
              <div className="w-fit">
                Total records: <strong>{resDB.length}</strong>
              </div>
            )}
          </div> */}
  
          {/* Data Output Section */}
          <div className="w-full h-4/6 overflow-auto p-3">
            <div className="w-full h-full overflow-auto rounded-lg bg-gray-100 scrollbar-custom-sql" ref={dataRef}>
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
          background: "green",
          color: "#fff",
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: "white",
            secondary: "black",
          },
        },
        error: {
          duration: 3000,
          style: {
            backgroundColor: "red",
            color: "white",
          },
          iconTheme: {
            primary: "white",
            secondary: "red",
          },
        },
      }}
    />
  </div>
  
  );
}

export default sqlIDETwo;
