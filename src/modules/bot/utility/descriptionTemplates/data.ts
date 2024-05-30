export const getHorizontalLineData = () => {
  return "[td][hr][/td]\n" as const;
};

export const getTextData = (
  text: string,
  align: "left" | "center" | "right" = "center",
  size: 8 | 10 | 12 | 14 | 16 = 10,
  bold = false,
  whitespaces = 2
) => {
  const spaces = Array(whitespaces).fill(" ").join("");
  const formattedText = bold ? `[b]${text}[/b]` : text;

  return `[td][${align}]${spaces}[size=${size}]${formattedText}${spaces}[/td]\n`;
};
