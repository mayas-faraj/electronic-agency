export const generateVerificationCode = () => {
    return '1988';
}

export const generateName = (email: string, firstName: string, lastName: string) => {
    return email != null ? email.substring(0, email.indexOf("@")) : (firstName + "_" + lastName).replace(" ", "").replace("-", "");
}
