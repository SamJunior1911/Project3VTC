export const maskSensitive = (input) => {
  if (input.includes("@")) {
    const [name, domain] = input.split("@");
    return `${name.slice(0, 2)}${"*".repeat(
      Math.max(name.length - 2, 0)
    )}@${domain}`;
  } else {
    return input.replace(/^(\d{0})\d+(\d{2})$/, (_, s, e) => `${s}*****${e}`);
  }
};
