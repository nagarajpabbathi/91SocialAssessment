import { CalendarIcon } from "@heroicons/react/solid";
import React from "react";
import { appointmentType } from "./types";

const MeetingComponent = ({ meeting }: { meeting: appointmentType }) => {
  return (
    <li key={meeting.id} className="relative flex space-x-6 py-6 xl:static">
      <div className="flex-auto">
        <h3 className="pr-10 font-semibold text-left text-gray-900 xl:pr-0">
          {meeting.name}
        </h3>
        <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row">
          <div className="flex items-start space-x-3">
            <dt className="mt-0.5">
              <span className="sr-only">Date</span>
              <CalendarIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </dt>
            <dd>
              <time dateTime={meeting.datetime + ""}>
                {meeting.date} at {meeting.time} to {meeting.endTime}
              </time>
            </dd>
          </div>
        </dl>
      </div>
    </li>
  );
};

export default MeetingComponent;
