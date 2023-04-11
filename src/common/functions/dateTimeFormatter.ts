export const dateTimeFormatter = (dateTime: string) => {
  const formattedStr = dateTime.replace('T', ' ');
  return formattedStr;
};
