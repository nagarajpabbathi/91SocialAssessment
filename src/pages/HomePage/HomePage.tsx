import { useEffect, useState } from "react";
import { generateCalendarData, sortingObjectsByDate } from "../../utils";
import CustomInput from "../../components/Inputs/CustomInput";
import moment from "moment";
import MeetingComponent from "./MeetingComponent";
import {
  appointmentForm,
  appointmentType,
  collideAppointmentType,
} from "./types";
import PrimaryButton from "../../components/Button/PrimaryButton";
import MonthlyCalendar from "./MonthlyCalendar";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [values, setValues] = useState<appointmentForm>({});
  const [upcomingMettings, setUpcomingMettings] = useState<appointmentType[]>(
    []
  );
  const [suggested, setSuggested] = useState<appointmentType | null>(null);
  const [collideEvent, setCollideEvent] = useState<collideAppointmentType>({});
  const [toggleView, setToggleView] = useState<boolean>(false);

  let dateTimeGenerate: any = (date: string) => {
    return new Date(date);
  };

  const generateEventData = (values: appointmentForm) => {
    let date = moment(values.datetime).format("MMMM Do, YYYY");
    let time = moment(values.datetime).format("h:mm a");
    let endTime = moment(values.endDateTime).format("h:mm a");
    let eventData = {
      ...values,
      date,
      time,
      endTime,
    };
    console.log(eventData);
    return eventData;
  };

  const isCollideCheck = (start1: any, start2: any, end1: any, end2: any) => {
    return (
      start1 == start2 ||
      (start1 < start2 && end1 > start2) ||
      (start1 >= start2 && start1 < end2)
    );
  };

  const addEventHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log("val ");
    let eventData = generateEventData(values);
    let collideEvent: { index: number; data: any } = {
      index: 0,
      data: null,
    };
    let isSuggested = false;
    let meetings = upcomingMettings;
    for (let index = 0; index < meetings.length; index++) {
      let each = meetings[index];
      let maxIndex = meetings.length - 1;
      let start1 = dateTimeGenerate(values.datetime);
      let start2 = dateTimeGenerate(each.datetime);
      let end1 = dateTimeGenerate(values.endDateTime);
      let end2 = dateTimeGenerate(each.endDateTime);
      if (isCollideCheck(start1, start2, end1, end2) && !collideEvent.data) {
        collideEvent = {
          index,
          data: each,
        };
        setCollideEvent(collideEvent);
      }
      if (index < maxIndex && collideEvent.data) {
        let nextMetting = meetings[index + 1];

        if (
          dateTimeGenerate(nextMetting.datetime).getTime() -
            dateTimeGenerate(each.endDateTime).getTime() >=
            dateTimeGenerate(values.endDateTime).getTime() -
              dateTimeGenerate(values.datetime).getTime() &&
          !isSuggested
        ) {
          let update = { ...values };
          update.datetime = dateTimeGenerate(each.endDateTime);
          update.endDateTime =
            dateTimeGenerate(each.endDateTime).getTime() +
            (dateTimeGenerate(values.endDateTime).getTime() -
              dateTimeGenerate(values.datetime).getTime());
          let suggestEventSlot = generateEventData(update);
          setSuggested(suggestEventSlot);
          isSuggested = true;
        }
        // break;
      } else if (index == maxIndex && collideEvent.data && !isSuggested) {
        let endMeeting = meetings[index];
        let update = { ...values };
        update.datetime = endMeeting.endDateTime;
        update.endDateTime =
          dateTimeGenerate(endMeeting.endDateTime).getTime() +
          (dateTimeGenerate(values.endDateTime).getTime() -
            dateTimeGenerate(values.datetime).getTime());
        let suggestEventSlot = generateEventData(update);
        setSuggested(suggestEventSlot);
        // break;
      }
    }

    let updateData = [...upcomingMettings, eventData];
    let sortedData = sortingObjectsByDate(updateData, "datetime");
    if (!collideEvent.data) {
      setUpcomingMettings(sortedData);
      localStorage.setItem("upcomingMettings", JSON.stringify(sortedData));
      setValues({});
    }
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    let meetings = localStorage.getItem("upcomingMettings");
    meetings && setUpcomingMettings(JSON.parse(meetings));
  }, []);

  const acceptRecommendSlot = () => {
    let updateData = [...upcomingMettings, suggested];
    let sortedData = sortingObjectsByDate(updateData, "datetime");
    localStorage.setItem("upcomingMettings", JSON.stringify(sortedData));
    setUpcomingMettings(sortedData);
    setSuggested(null);
    setValues({});
  };
  const postphoneOverlapHandler = () => {
    let newEvent = generateEventData(values);
    let prioritize = newEvent;
    let meetings = [...upcomingMettings];
    for (let i = collideEvent.index || 0; i < meetings?.length - 1; i++) {
      let current = { ...meetings[i] };
      current.endDateTime =
        dateTimeGenerate(prioritize.endDateTime).getTime() +
        (dateTimeGenerate(current.endDateTime).getTime() -
          dateTimeGenerate(current.datetime).getTime());
      current.datetime = prioritize.endDateTime;
      current = generateEventData(current);
      meetings[i] = current;
      let next = meetings[i + 1];
      let start1 = dateTimeGenerate(current.datetime);
      let start2 = dateTimeGenerate(next.datetime);
      let end1 = dateTimeGenerate(current.endDateTime);
      let end2 = dateTimeGenerate(next.endDateTime);
      let newStart = dateTimeGenerate(newEvent.datetime);
      let newEnd = dateTimeGenerate(newEvent.endDateTime);
      if (
        isCollideCheck(start1, start2, end1, end2) ||
        isCollideCheck(start2, newStart, end2, newEnd)
      ) {
        prioritize = { ...current };
      } else {
        break;
      }
    }
    let updateData = [...meetings, newEvent];
    let sortedData = sortingObjectsByDate(updateData, "datetime");
    setUpcomingMettings(sortedData);
    localStorage.setItem("upcomingMettings", JSON.stringify(sortedData));
    setValues({});
  };

  return (
    <div className=" md:mx-auto max-w-5xl mt-4 ">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        <p
          onClick={() => setToggleView(false)}
          className={classNames(
            !toggleView
              ? "border-indigo-500 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
            "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer"
          )}
        >
          List View
        </p>
        <p
          onClick={() => setToggleView(true)}
          className={classNames(
            toggleView
              ? "border-indigo-500 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
            "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer"
          )}
        >
          Calendar View
        </p>
      </nav>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-16"></div>
      <div className="sm:flex  p-5">
        {
          !toggleView &&
          <div className="flex-1 divide-y divide-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming Appointments
          </h2>
          <ol className="mt-4  text-sm leading-6 lg:col-span-7 xl:col-span-8">
            <li>
              {!upcomingMettings?.length && (
                <p className="mt-10">No upcoming Appointments...</p>
              )}
            </li>
            {upcomingMettings.map((meeting: appointmentType) => (
              <MeetingComponent meeting={meeting} />
            ))}
          </ol>
        </div>}

        <form className="flex-1" onSubmit={addEventHandler}>
          <h2 className="text-lg  mb-2 font-semibold text-gray-900">
            Add Appointment form
          </h2>
          <CustomInput
            onChange={inputChangeHandler}
            name="name"
            label="Appointment Title"
            value={values.name || ""}
            required
          />
          <CustomInput
            onChange={inputChangeHandler}
            name="datetime"
            type="datetime-local"
            label="Event Start"
            value={values.datetime || ""}
            required
          />
          <CustomInput
            onChange={inputChangeHandler}
            label="Event End"
            type="datetime-local"
            name="endDateTime"
            value={values.endDateTime || ""}
            min={values.datetime}
            required
          />
          <button
            type="submit"
            className="focus:outline-none mt-8 w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add event
          </button>
          {suggested ? (
            <>
              <h1 className="font-bold -mb-4 mt-4 text-red-700 text-lg text-left">
                Your slot Overlapped
              </h1>
              <MeetingComponent meeting={suggested} />
              <PrimaryButton
                onClick={acceptRecommendSlot}
                title="Accept Recommend slot"
              />
              <PrimaryButton
                onClick={postphoneOverlapHandler}
                title="Postphone overlap slots"
              />
            </>
          ) : null}
        </form>
      </div>
      {toggleView && <MonthlyCalendar meetings={upcomingMettings} />}
    </div>
  );
}
