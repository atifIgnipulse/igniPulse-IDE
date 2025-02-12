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

function SqlIDE() {
  const [outputHeight, setOutputHeight] = useState(20);
  const [isDragging, setIsDragging] = useState(false);
  const dataRef = useRef(null);

  const textAreaRef = useRef(null);
  const [editorContent, setEditorContent] = useState("");
  const [resDB, setResDb] = useState([]);
  const [dataBases, setDataBases] = useState([]);

  const [tabIsOpen, setTabIsOpen] = useState(false);

  const [tables, setTables] = useState([]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (dataRef.current) {
      dataRef.current.scrollTop = 0; 
    }
  }, [resDB]);

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
  const getTables = (db) => {
    console.log(db);
    Config.getTables(db)
      .then((res) => {
        setTables(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDataBases = () => {
    Config.getDataBases()
      .then((res) => {
        // console.log(res.data)
        setDataBases([...res.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  const handleRun = () => {
    console.log("first");
    const data = textAreaRef.current.view?.state?.doc?.toString();
    if (data == "") {
      setEditorContent("");
      return;
    } else {
      setEditorContent(data);
      
    }

    Config.postData(data)
      .then((res) => {
        if (res.data.success) {
          toast.success("success");
          setResDb(res.data.result);
          getDataBases()
        } else {
          setResDb([]);
          toast(res.data.sqlMessage);
          console.log(res.data);
        }
      })
      .catch((err) => {
        toast.error(err.message || "An unexpected error occurred");
        setResDb([]);
      });
  };


  useEffect(() => {
    getDataBases();
  }, []);

  const handleDownload = async () => {
    if (window.showSaveFilePicker) {
      const fileHandler = await window.showSaveFilePicker({
        suggestedName: "code.py",
        types: [
          {
            accept: { "text/plain": [".sql"] },
          },
        ],
      });

      const writeAbleStream = await fileHandler.createWritable();
      await writeAbleStream.write(
        textAreaRef.current.view.state.doc.toString()
      );
      await writeAbleStream.close();
    } else {
      const element = document.createElement("a");
      const file = new Blob(
        [textAreaRef.current.view.state.doc.toString() || ""],
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
    <div className="flex flex-col h-screen">
      <div
        className="overflow-hidden flex flex-col items-center justify-center bg-[#FFFFFF]"
        onMouseMove={handleMouseMoveVertical}
        onMouseUp={handleMouseUp}
        style={{ flexGrow: 1 }}
      >
        <div className="flex py-3 px-8 w-full justify-between">
          <div className="flex gap-x-2 items-end h-[10vh]">
            <button
              className="text-sm font-semibold flex items-center justify-between gap-x-4 bg-[#374151] h-1/2 px-2 rounded hover:bg-[#323a47] text-zinc-50 tracking-wider cursor-pointer"
              onClick={() => setEditorContent("")}
            >
              Clear <Eraser size="18" />
            </button>
            <DatabaseLayout dataBases={dataBases} getTables={getTables} />
            <TableLayout tables={tables} />
          </div>
          <div className="flex items-end gap-x-2">
            <button
              className="text-sm bg-[#7FBA00] font-semibold flex items-center justify-between gap-x-2 h-1/2 px-2 rounded hover:bg-[#86b228] text-zinc-900 tracking-wider cursor-pointer"
              onClick={handleRun}
            >
              Execute <Play size="18" />
            </button>

            <button
              className="text-sm font-semibold flex items-center justify-between gap-x-4 bg-[#2677C7] h-1/2 px-2 rounded hover:bg-[#0072C6] text-zinc-50 tracking-wider cursor-pointer"
              onClick={openFile}
            >
              Open Script <File size="18" />
            </button>
            <button
              className="text-sm font-semibold flex items-center justify-between gap-x-4 bg-[#374151] h-1/2 px-2 rounded hover:bg-[#323a47] text-zinc-50 tracking-wider cursor-pointer"
              onClick={handleDownload}
            >
              Save Script <Save size="18" />
            </button>
          </div>
        </div>

        <div className="h-full w-full flex flex-col justify-start items-center">
          <div
            className="flex-grow w-full"
            style={{
              maxHeight: "calc(100vh - 90vh)",
              overflowY: "auto",
            }}
          >
            <CodeMirror
              value={editorContent}
              className="w-full border text-[1rem]"
              extensions={[sql()]}
              ref={textAreaRef}
              options={{
                lineNumbers: true,
              }}
            />
          </div>

          <div className="w-full flex items-center justify-end px-4">
            {resDB.length > 0 && (
              <div className="w-fit gap-x-5">
                Total records: <strong>{resDB.length}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="overflow-auto absolute bottom-0"
        ref={dataRef}
        style={{ height: "calc(70vh)", width: "100%" }}
      >
        {resDB.length > 0 && <Data res={resDB} />}
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
    </div>
  );
}

export default SqlIDE;
