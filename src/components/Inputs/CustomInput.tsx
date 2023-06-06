import React from "react";

const CustomInput = (props:any) => {
  return (
    <div className="sm:col-span-3 mb-1">
      <label
        htmlFor="first-name"
        className="block text-left text-sm font-medium leading-6 text-gray-900"
      >
        {props.label}
      </label>
      <div className="mt-0">
        <input
          min={props.min || null}
          max={props.max || null}
          type={props.type}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          required={props.required}
          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};

export default CustomInput;
