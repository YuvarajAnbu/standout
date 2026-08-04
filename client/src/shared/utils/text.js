export function truncate(value, maxLength, omission = "...") {
  const text = String(value ?? "");
  if (text.length <= maxLength) return text;
  if (maxLength <= omission.length) return omission.slice(0, maxLength);

  return `${text.slice(0, maxLength - omission.length).trimEnd()}${omission}`;
}
