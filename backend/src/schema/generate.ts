export const generateVerificationCode = () => {
    return Math.floor(Math.random() * 10000).toString().padStart(4, "0");
}

export const generateName = (email: string, firstName: string, lastName: string) => {
    return email != null ? email.substring(0, email.indexOf("@")) : (firstName + "_" + lastName).replace(" ", "").replace("-", "");
}
