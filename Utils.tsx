import moment from "moment";

export const checkDate = (date: Date) => {
  const momentDate = moment(date);
  const today = moment().startOf("day");
  const tomorrow = moment().add(1, "days").startOf("day");

  if (momentDate.isSame(today, "day")) {
    return "Today, ";
  } else if (momentDate.isSame(tomorrow, "day")) {
    return "Tomorrow, ";
  } else {
    return "";
  }
};
