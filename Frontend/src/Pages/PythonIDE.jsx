import { React, useState, useRef, useEffect } from "react";
import { Eraser, File, Play, Save } from "lucide-react";
import { io } from "socket.io-client";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { python } from "@codemirror/lang-python";

function PythonIDE() {
  const editorRef = useRef(null);

  const [outputWidth, setOutputWidth] = useState(30);
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
      if (newWidth > 30 && newWidth < 80) {
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
      // socket.current = io("http://localhost:9000");

      const handlePyResponse = (message) => {
        setDisable(false);

        let formattedMessage = message.replace(/\r\n|\r|\n/g, "\n");

        if (formattedMessage.startsWith("\n")) {
          formattedMessage = "<br>" + formattedMessage.trimStart();
        }
        if (formattedMessage.endsWith("\n")) {
          formattedMessage = formattedMessage.trimEnd() + "<br>";
        }
        formattedMessage = formattedMessage.replace(/\n/g, "<br>");

        const res = document.createElement("div");
        res.innerHTML = formattedMessage;
        res.style.paddingBottom = "6px";

        document.getElementById("outputDiv").appendChild(res);
      };

      const handleExitSuccess = () => {
        const exitMsg = document.createElement("p");
        exitMsg.innerText = "--- Program Exited Successfully ---";
        exitMsg.style.color = "green";
        exitMsg.style.fontWeight = "bold";
        exitMsg.style.marginTop = "10px";
        exitMsg.style.textAlign = "center";

        document.getElementById("outputDiv").appendChild(exitMsg);
      };

      socket.current.on("pyResponse", handlePyResponse);
      socket.current.on("EXIT_SUCCESS", handleExitSuccess);

      socket.current.on("userInput", (message) => {
        setDisable(false);
        const outputDiv = document.getElementById("outputDiv");

        // Normalize newlines to ensure consistency
        let formattedMessage = message.replace(/\r\n|\r|\n/g, "\n");

        // Extract lines while preserving newlines
        const lines = formattedMessage
          .match(/[^\n]*(\n|$)/g)
          .filter((line) => line !== "");

        // Process all lines except the last one
        lines.slice(0, -1).forEach((line) => {
          const lineDiv = document.createElement("div");
          lineDiv.innerHTML = line.replace(/\n/g, "<br>");
          lineDiv.style.color = "black";
          lineDiv.style.marginBottom = "5px";
          outputDiv.appendChild(lineDiv);
        });

        // Create a container for the input prompt
        const inputPromptDiv = document.createElement("div");
        inputPromptDiv.id = "inputPromptDiv";
        inputPromptDiv.style.marginTop = "0px";
        inputPromptDiv.style.display = "flex";
        inputPromptDiv.style.alignItems = "center";
        inputPromptDiv.style.justifyContent = "start";

        // Create a label for the last line
        const promptLabel = document.createElement("label");
        promptLabel.innerHTML = lines[lines.length - 1].replace(/\n/g, "<br>");
        promptLabel.style.marginRight = "10px";
        promptLabel.style.color = "black";

        // Create the input box
        const inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.id = "dynamicInput";
        inputBox.style.padding = "0px";
        inputBox.style.outline = "none";
        inputBox.style.backgroundColor = "inherit";
        inputBox.style.color = "black";

        // Append label and input box to inputPromptDiv
        inputPromptDiv.appendChild(promptLabel);
        inputPromptDiv.appendChild(inputBox);

        // Append inputPromptDiv to the outputDiv
        outputDiv.appendChild(inputPromptDiv);

        // Focus on the input box
        inputBox.focus();

        // Handle Enter key event
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
        socket.current?.off("pyResponse", handlePyResponse);
        socket.current?.off("EXIT_SUCCESS", handleExitSuccess);
      }
    };
  }, []);

  const handleRun = async () => {
    // console.log("first")
    if (editorContent != "") {
      setDisable(true);
      clearOutput();
      socket.current.close();
      socket.current.connect();
      // Emit the input data to the server using Socket.IO
      socket.current.emit("runPy", editorContent);
    }
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
  const handleClear = () => {
    if (editorContent) {
      setEditorContent("");
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }
  };
  const fullHeightEditor = EditorView.theme({
    ".cm-scroller": {
      maxHeight: "90vh !important", // Fixed height for scrolling
      overflow: "auto !important", // Ensure scrollbars appear when needed
    },
    ".cm-content": {
      minHeight: "90vh !important", // Prevents extra height
      whiteSpace: "pre", // Prevents text wrapping
    },
    ".cm-gutter": {
      minHeight: "90vh !important", // Aligns with `.cm-content`
    },
  });
  const customScrollbar = EditorView.theme({
    ".cm-scroller": {
      scrollbarWidth: "thin", // For Firefox
    },
    "::-webkit-scrollbar": {
      width: "8px", // Scrollbar width
      height: "8px", // Horizontal scrollbar height
    },
    "::-webkit-scrollbar-track": {
      background: "#1E1E1E", // Track color
      borderRadius: "5px",
    },
    "::-webkit-scrollbar-thumb": {
      background: "#bb8c00", // Thumb color
      borderRadius: "5px",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#005BBB", // Thumb hover effect
    },
  });

  return (
    <div
      className="overflow-hidden w-full h-screen flex flex-col items-center justify-start bg-white text-black"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="flex items-center justify-between gap-x-2 lg:px-8 md:px-8 px-1 py-1 h-[8vh] w-full bg-gray-300">
        <div className="flex items-center justify-between gap-x-2">
          <button
            className="cursor-pointer text-xs font-semibold flex items-center gap-x-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-white tracking-wider"
            onClick={handleClear}
          >
            Clear <Eraser size={18} />
          </button>
          <button
            disabled={disable}
            className="cursor-pointer text-sm bg-green-600 font-semibold px-4 py-2 w-24 rounded hover:bg-green-700 text-white tracking-wide"
            onClick={handleRun}
          >
            {disable ? (
              <div className="w-full flex justify-center items-center">
                <div className="border-4 border-t-transparent border-white rounded-full animate-spin size-4"></div>
              </div>
            ) : (
              <div className="flex items-center gap-x-1 text-xs">
                Execute <Play size={14} />
              </div>
            )}
          </button>
        </div>
        <div className="flex items-center gap-x-2">
          <button
            className="cursor-pointer text-xs font-semibold flex items-center gap-x-2 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white tracking-wide"
            onClick={openFile}
          >
            Open Script <File size={18} />
          </button>
          <button
            className="cursor-pointer text-xs font-semibold flex items-center gap-x-2 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white tracking-wide"
            onClick={handleDownload}
          >
            Save <Save size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row md:flex-row h-full overflow-hidden w-full">
        <div
          className="flex items-center justify-center"
          style={
            mobile
              ? { height: `${100 - outputHeight}%`, width: "100%" }
              : { width: `${100 - outputWidth}%`, height: "100%" }
          }
        >
          {/* <div className="h-full w-full grid place-items-center bg-gray-100">
          <div className="w-full h-full overflow-hidden">
            <div className="flex items-center justify-center w-full h-full overflow-auto scrollbar-custom"> */}
          <CodeMirror
            value={editorContent}
            className="w-full text-[1rem] scrollbar-custom border border-gray-300 overflow-hidden"
            theme="light"
            extensions={[fullHeightEditor, customScrollbar]}
            onChange={(newContent) => setEditorContent(newContent)}
            options={{ lineNumbers: true }}
            onCreateEditor={(editor) => {
              editorRef.current = editor;
            }}
          />
          {/* </div>
          </div>
        </div> */}
        </div>
        <svg
          className={`${
            mobile ? "rotate-90 w-fit" : "h-full bg-gray-300"
          } cursor-e-resize`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          width="15px"
          height="20px"
          viewBox="0 0 64 64"
          fill="#000"
        >
          <line
            fill="none"
            stroke="#000"
            strokeWidth="2"
            x1="24"
            y1="0"
            x2="24"
            y2="64"
          />
          <line
            fill="none"
            stroke="#000"
            strokeWidth="2"
            x1="32"
            y1="0"
            x2="32"
            y2="64"
          />
          <line
            fill="none"
            stroke="#000"
            strokeWidth="2"
            x1="40"
            y1="0"
            x2="40"
            y2="64"
          />
        </svg>
        <div
          className="relative flex flex-col items-end gap-y-2 bg-gray-100 border-l border-gray-300 "
          style={
            mobile
              ? { height: `${outputHeight}%`, width: "100%" }
              : { width: `${outputWidth}%`, height: "100%" }
          }
        >
          <div className="w-full flex items-center justify-between bg-gray-200 px-4">
            <h2 className="w-full text-xl font-semibold tracking-wider text-black py-2 ">
              Output
            </h2>
            <button
              className="w-fit cursor-pointer text-sm bg-red-600 font-semibold flex items-center gap-x-2 px-4 py-2 rounded hover:bg-red-700 text-white tracking-wide"
              onClick={clearOutput}
            >
              Clear <Eraser size={18} />
            </button>
          </div>
          <div
            className="w-full h-full leading-snug tracking-widest text-black text-start text-[.9rem] overflow-auto ps-5 scrollbar-custom"
            id="outputDiv"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default PythonIDE;
