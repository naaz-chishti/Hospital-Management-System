const formatDate = (date) => {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }
  ).format(date);
};

export default formatDate;