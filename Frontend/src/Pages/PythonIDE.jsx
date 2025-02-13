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
  // const textAreaRef = useRef(null);
  const [textArea, setTextArea] = useState("")
  const [saved, setSaved] = useState(false);
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

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://51.24.30.180:9000");

    socket.current.on("pyResponse", (message) => {
      // Display normal responses
      // console.log(message.replace(/(\r\n|\n)/g, "<br>"))
      document.getElementById("outputDiv").innerHTML = message.replace(
        /(\r\n|\n)/g,
        "<br>"
      );
    });

    socket.current.on("userInput", (message) => {
      // Get the outputDiv
      const outputDiv = document.getElementById("outputDiv");

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
      promptLabel.style.color = "black";

      // Create the input box
      const inputBox = document.createElement("input");
      inputBox.type = "text";
      inputBox.id = "dynamicInput";
      inputBox.style.padding = "5px";
      inputBox.style.outline = "none";
      inputBox.style.backgroundColor = "inherit";
      inputBox.style.color = "black";

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
            outputDiv.removeChild(inputPromptDiv); // Remove the prompt field
          }
        }
      });
    });

    return () => {
      // Clean up the WebSocket connection
      socket.current.disconnect();
    };
  }, []);

  const handleRun = async () => {
    // const data = textAreaRef.current.view.state.doc.toString();
    setEditorContent(textArea);
    // Emit the input data to the server using Socket.IO
    socket.current.emit("runPy", textArea);
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
      await writeAbleStream.write(
        // textAreaRef.current.view.state.doc.toString()
        textArea
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
      className="overflow-hidden w-full h-full flex flex-col items-center justify-center bg-[#ffffff]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="flex items-center justify-between px-8 py-2 w-full">
        <div className="flex items-center justify-between gap-x-2">
          <button
            className="text-sm sm:text-base font-semibold flex items-center justify-between gap-x-4 bg-[#374151] lg:px-4 md:px-4 px-2 py-2 rounded hover:bg-[#323a47] text-zinc-50 tracking-wider"
            onClick={() => setEditorContent("")}
          >
            Clear <Eraser size="18" />
          </button>
        </div>

        <div className="flex gap-x-2 px-2">
          <button
            className="cursor-pointer text-sm sm:text-base bg-green-600 font-semibold flex items-center justify-between gap-x-4 lg:px-4 md:px-4 px-2 py-2 rounded hover:bg-green-700 text-zinc-50 tracking-wider"
            onClick={handleRun}
          >
            Run <Play size="18" />
          </button>
          <button
            id="check"
            className="cursor-pointer text-sm sm:text-base font-semibold flex items-center justify-between gap-x-4 bg-[#f2c627] lg:px-4 md:px-4 px-2 py-2 rounded hover:bg-[#c8a93a] text-zinc-900 tracking-wider"
            onClick={openFile}
          >
            Open File <File size="18" />
          </button>
          <button
            className="cursor-pointer text-sm sm:text-base font-semibold flex items-center justify-between gap-x-4 bg-[#374151] lg:px-4 md:px-4 px-2 py-2 rounded hover:bg-[#323a47] text-zinc-50 tracking-wider"
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
                  extensions={[python()]}
                  // ref={textAreaRef}
                  onChange={(e)=> setTextArea(e.target.value)}
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
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="20px"
          height="20px"
          viewBox="0 0 64 64"
          enableBackground="new 0 0 64 64"
          xmlSpace="preserve"
          fill="#000000"
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
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              x1="24"
              y1="0"
              x2="24"
              y2="64"
            ></line>{" "}
            <line
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeMiterlimit="10"
              x1="32"
              y1="0"
              x2="32"
              y2="64"
            ></line>{" "}
            <line
              fill="none"
              stroke="#000000"
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
          className="bg-[#FFFFFF] border relative lg:py-4 md:py-2 lg:px-5 md:px-2 px-6 flex flex-col gap-y-4 p-4 text-gray-900"
          style={
            mobile
              ? { height: `${outputHeight}%`, width: "100%" }
              : { width: `${outputWidth}%`, height: "100%" }
          }
        >
          <h2 className="text-lg font-semibold leading-tight tracking-wider select-none">
            Output
          </h2>
          <div
            className="leading-snug tracking-widest text-zinc-900 text-justify text-[.9rem] overflow-y-auto overflow-x-hidden"
            id="outputDiv"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default PythonIDE;
