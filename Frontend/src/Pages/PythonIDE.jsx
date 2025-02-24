import { React, useState, useRef, useEffect } from "react";
import { Eraser, File, Play, Save } from "lucide-react";
import { io } from "socket.io-client";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

function PythonIDE() {
  const [outputWidth, setOutputWidth] = useState(20);
  const [outputHeight, setOutputHeight] = useState(20);
  const [isDragging, setIsDragging] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [disable, setDisable] = useState(false);
  const [editorContent, setEditorContent] = useState(""); // Editor content state

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMoveHorizontal = (e) => {
    if (isDragging) {
      const newWidth =
        ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
      if (newWidth > 10 && newWidth < 80) {
        // Set limits for resizing
        setOutputWidth(newWidth);
      }
    }
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

  const handleMouseMove = (e) => {
    if (window.innerWidth >= 1024) {
      setMobile(false);
      handleMouseMoveHorizontal(e);
    } else {
      setMobile(true);
      handleMouseMoveVertical(e);
    }
  };

  const clearOutput = () => {
    document.getElementById("outputDiv").innerText = "";
  };

  const socket = useRef(null);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("https://igniup.com", {
        path: "/socket.io/",  
        transports: ["websocket", "polling"],  
        withCredentials: true 
    });

      socket.current.on("pyResponse", (message) => {
        setDisable(false);
        // Display normal responses
        // console.log(message.replace(/(\r\n|\n)/g, "<br>"))
        const res = document.createElement("div");
        res.innerHTML = message.replace(/(\r\n|\n)/g, "<br>");
        res.style.borderBottom = "2px solid white";
        res.style.borderBottomStyle = "dashed";
        res.style.paddingBottom = "6px";
        res.style.paddingTop = "6px";
        document.getElementById("outputDiv").appendChild(res);
      });

      socket.current.on("userInput", (message) => {
        clearOutput()
        // Get the outputDiv
        const outputDiv = document.getElementById("outputDiv");
        // outputDiv.innerText = "";

        // Create a new div for the input prompt
        const inputPromptDiv = document.createElement("div");
        inputPromptDiv.id = "inputPromptDiv";
        inputPromptDiv.style.marginTop = "10px";
        inputPromptDiv.style.display = "flex";
        inputPromptDiv.style.alignItems = "center";

        // Create a label for the prompt message
        const promptLabel = document.createElement("label");
        promptLabel.innerText = message;
        promptLabel.style.marginRight = "10px";
        promptLabel.style.color = "white";

        // Create the input box
        const inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.id = "dynamicInput";
        inputBox.style.padding = "5px";
        inputBox.style.outline = "none";
        inputBox.style.backgroundColor = "inherit";
        inputBox.style.color = "white";

        // Append the label and input box to the inputPromptDiv
        inputPromptDiv.appendChild(promptLabel);
        inputPromptDiv.appendChild(inputBox);

        // Append the inputPromptDiv to the outputDiv
        outputDiv.appendChild(inputPromptDiv);

        // Focus on the input box
        inputBox.focus();

        // Add an event listener for the Enter key
        inputBox.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            const userInput = inputBox.value.trim();
            if (userInput) {
              socket.current.emit("userEntry", userInput);
              inputBox.disabled = true;
            }
          }
        });
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, []);

  const handleRun = async () => {
    // console.log("first")
    setDisable(true);
    clearOutput()
    // Emit the input data to the server using Socket.IO
    socket.current.emit("runPy", editorContent);
  };

  const handleDownload = async () => {
    if (window.showSaveFilePicker) {
      const fileHandler = await window.showSaveFilePicker({
        suggestedName: "code.py",
        types: [
          {
            accept: { "text/plain": [".py"] },
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
      element.download = `code.py`;
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
            "text/plain": [".txt", ".py"],
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
    <div
      className="overflow-hidden w-full h-full flex flex-col items-center justify-center bg-[#101828]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="flex items-center justify-between gap-x-2 lg:px-8 md:px-8 px-1 py-2 w-full">
        <div className="flex items-center justify-between gap-x-2">
          <button
            className="cursor-pointer text-sm sm:text-base font-semibold flex items-center justify-between gap-x-2 bg-red-600 lg:px-4 md:px-4 px-2 py-2 rounded hover:bg-[#323a47] text-zinc-50 tracking-wider"
            onClick={() => setEditorContent("")}
          >
            Clear <Eraser size="18" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-x-2">
          <button
            disabled={disable}
            className="cursor-pointer text-sm sm:text-base bg-green-600 font-semibold lg:px-2 md:px-4 px-2 py-2 w-24 rounded hover:bg-green-700 text-zinc-50 tracking-wide"
            onClick={handleRun}
          >
            {disable ? (
              <div className="w-full flex justify-center items-center size-6 lg:px-4 md:px-4 px-2 py-2">
                <div className=" border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-between gap-x-1">
                <>Execute</> <Play  size="14"/>
              </div>
            )}
          </button>
          <button
            id="check"
            className="cursor-pointer lg:text-sm md:text-sm text-xs sm:text-base font-semibold flex items-center justify-between gap-x-3 bg-[#ba9306] lg:px-4 md:px-4 px-1 py-2 rounded hover:bg-[#c8a93af0] text-zinc-50 tracking-wide"
            onClick={openFile}
          >
            Open Script <File size="18" />
          </button>
          <button
            className="cursor-pointer lg:text-sm md:text-sm text-xs sm:text-base font-semibold flex items-center justify-between gap-x-3 bg-[#374151] lg:px-4 md:px-4 px-2 py-2 rounded hover:bg-[#323a47] text-zinc-50 tracking-wide"
            onClick={handleDownload}
          >
            Save <Save size="18" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row md:flex-row h-[90vh] w-full">
        {" "}
        <div
          className={`flex items-center justify-center`}
          style={
            mobile
              ? { height: `${100 - outputHeight}%`, width: "100%" }
              : { width: `${100 - outputWidth}%`, height: "100%" }
          }
        >
          <div className="h-full w-full grid place-items-center">
            <div className="w-full h-full overflow-hidden">
              <div className="flex items-center justify-center w-full h-full overflow-auto ">
                <CodeMirror
                  value={editorContent}
                  className="w-full h-full border text-[1rem]"
                  // extensions={[python()]}
                  theme="dark"
                  onChange={(newContent) => setEditorContent(newContent)}
                  options={{
                    lineNumbers: true,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <svg
          className={`${
            mobile ? "rotate-90 w-full" : "h-full"
          } lg:cursor-col-resize md:cursor-col-resize cursor-row-resize`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="20px"
          height="20px"
          viewBox="0 0 64 64"
          enableBackground="new 0 0 64 64"
          xmlSpace="preserve"
          fill="#ffffff"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <line
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeMiterlimit="10"
              x1="24"
              y1="0"
              x2="24"
              y2="64"
            ></line>{" "}
            <line
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeMiterlimit="10"
              x1="32"
              y1="0"
              x2="32"
              y2="64"
            ></line>{" "}
            <line
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeMiterlimit="10"
              x1="40"
              y1="0"
              x2="40"
              y2="64"
            ></line>{" "}
          </g>
        </svg>
        <div
          className="bg-transparent border relative lg:py-2 md:py-2 lg:px-3 md:px-2 px-6 flex flex-col items-end gap-y-2 p-4 "
          style={
            mobile
              ? { height: `${outputHeight}%`, width: "100%" }
              : { width: `${outputWidth}%`, height: "100%" }
          }
        >
          <h2 className="w-full text-2xl text-center font-semibold leading-tight tracking-wider select-none bg-gray-700 text-white py-2">
            Output
          </h2>
          <button
            className="w-fit cursor-pointer text-sm sm:text-base bg-red-600 font-semibold flex items-center justify-between gap-x-4 lg:px-4 md:px-4 px-2 py-2 rounded hover:bg-red-700 text-zinc-50 tracking-wider"
            onClick={clearOutput}
          >
            <Eraser size="18" />
          </button>
          <div
            className="w-full leading-snug tracking-widest text-white text-justify text-[.9rem] overflow-y-auto overflow-x-hidden ps-2"
            id="outputDiv"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default PythonIDE;
