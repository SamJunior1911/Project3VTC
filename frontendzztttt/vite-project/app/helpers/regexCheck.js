export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhone = (value) => {
  const regex = /^(0\d{9})$/;
  return regex.test(value);
};
