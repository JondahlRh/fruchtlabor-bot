export const getEmptyRow = () => {
  return "[tr][/tr]\n" as const;
};

export const getHorizontalLineRow = () => {
  return "[tr][td][hr][/td][/tr]\n" as const;
};

export const getSpacerRow = (width = 120) => {
  const spaces = Array(width).fill(" ").join("");
  return `[tr][td]${spaces}[/td][/tr]\n` as const;
};

export const getTextRow = (
  text: string,
  align: "left" | "center" | "right" = "center",
  size: 8 | 10 | 12 | 14 | 16 = 10,
  bold = false
) => {
  const boldEl = bold ? "[b]" : "";

  return text
    .split("\n")
    .map((row) => `[tr][td][${align}][size=${size}]${boldEl}${row}[/td][/tr]\n`)
    .join("");
};

export const getListRow = (
  items: string[],
  minDisplayCount: number,
  defaultValue: string
) => {
  let description = "[tr][td][list]\n";

  while (items.length < minDisplayCount) {
    items.push(defaultValue);
  }

  for (const value of items) {
    description += `[*] ${value}\n`;
  }

  return description + "[/list][/td][/tr]\n";
};
