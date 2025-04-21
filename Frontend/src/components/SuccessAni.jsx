import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function SuccessAni({ message }) {
  return (
    <div className="absolute top-18 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center justify-center">
      <DotLottieReact
        className="w-8 h-8"
        src="https://lottie.host/11d546f5-5956-42f7-ad82-7ddfd1bb5f2f/8BjoZAkGvk.lottie"
        autoplay
      />
      <p className="text-xs font-black">{message}</p>
    </div>
  );
}

export default SuccessAni;
