import React from "react";

const PrimaryButton = (props: any) => {
  return (
    <button
      onClick={props?.onClick}
      disabled={props?.disabled}
      type="submit"
      className="focus:outline-none mt-4 w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {props?.title||""}
    </button>
  );
};

export default PrimaryButton;
