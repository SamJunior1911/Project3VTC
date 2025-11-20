export const days = Array.from({ length: 31 }, (_, i) => {
  const day = (i + 1).toString().padStart(2, "0");
  return { label: day, value: day };
});

export const months = Array.from({ length: 12 }, (_, i) => {
  const month = (i + 1).toString().padStart(2, "0");
  return { label: month, value: month };
});

const currentYear = new Date().getFullYear();
export const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => {
  const year = (currentYear - i).toString();
  return { label: year, value: year };
});

export const getDay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.getUTCDate().toString().padStart(2, "0");
};

export const getMonth = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return (date.getUTCMonth() + 1).toString().padStart(2, "0");
};

export const getYear = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.getUTCFullYear().toString();
};
