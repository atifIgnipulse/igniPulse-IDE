import React from "react";

function Button({ text, icon, action, classNames }) {
  return (
    <button
      className={classNames}
      onClick={action}
    >
      <p className="text-xs">{text}</p>
      {icon}
    </button>
  );
}

export default Button;
