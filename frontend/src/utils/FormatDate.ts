type DateFormat = "date" | "dateTime";

export function formatDate(value: string | Date | null | undefined, format: DateFormat = "date"): string {
  if (!value) return "-";

  if (typeof value === "string" && (/^\d{4}-\d{2}-\d{2}$/).test(value) && format === "date") {
    const [year, month, day] = value.split("-");
    return `${day}-${month}-${year}`;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const datePart = [
    String(date.getDate()).padStart(2, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    date.getFullYear(),
  ].join("-");

  if (format === "date") return datePart;

  const hours = date.getHours();
  const timePart = `${String(hours % 12 || 12).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;

  return `${datePart} ${timePart}`;
}
