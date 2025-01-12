export const generateVerificationCode = () => {
  return Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
};

export const generateName = (
  phone?: string,
  email?: string,
  firstName?: string,
  lastName?: string
) => {
  return phone != null
    ? phone
    : email != null
    ? email.substring(0, email.indexOf("@"))
    : (firstName + "_" + lastName).replace(" ", "").replace("-", "");
};
