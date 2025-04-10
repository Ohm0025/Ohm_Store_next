export const generateNumberOrder = () => {
  const prefix = "ORD";
  const timestamp = new Date().getTime().toString().substring(3, 10);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0"); //0 - 999.9999 -> cut .9999 -> get 3 number replace 0 in front
  return `${prefix}${timestamp}${random}`;
};
