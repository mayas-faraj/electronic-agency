import fetch, { Headers } from "node-fetch";

const sendSms = async (
  destinationPhone: string,
  codeText: string,
  callback: (result: string) => void
) => {
  let messageText = "Your verification code is: " + codeText;
  let phone = destinationPhone;
  if (phone.startsWith("00")) phone = phone.substring(2);
  if (phone.startsWith("0")) phone = "964" + phone.substring(1);
  else if (phone.startsWith("+")) phone = phone.substring(1);

  const response = await fetch(`https://rest.mittoapi.com/sms`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      "X-Mitto-API-Key": "Rw2er96S6h8tmOGwGtDRyj2e5barmKcH",
    }),
    body: JSON.stringify({
      from: "spacetech1",
      to: phone,
      text: messageText
    }),
  });
  const responseText = await response.text();
  callback(responseText);
};

export { sendSms };
