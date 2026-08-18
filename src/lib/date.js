export function getDhakaDateOnly() {
  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).formatToParts(
      new Date()
    );

  const year =
    parts.find(
      (item) =>
        item.type === "year"
    )?.value;

  const month =
    parts.find(
      (item) =>
        item.type === "month"
    )?.value;

  const day =
    parts.find(
      (item) =>
        item.type === "day"
    )?.value;

  return `${year}-${month}-${day}`;
}