export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "__";

  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export const getStatus = (dateCompletion: string | null | undefined) => {
  return dateCompletion ? "Completed" : "Ongoing";
};
