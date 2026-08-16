import axios from "axios";


export async function sendSMS(
  phone,
  message
) {


  try {


    const smsData =
      new URLSearchParams();


    smsData.append(
      "token",
      process.env.GREENWEB_SMS_TOKEN
    );


    smsData.append(
      "to",
      phone
    );


    smsData.append(
      "message",
      message
    );



    const response =
      await axios.post(

        "https://api.bdbulksms.net/api.php",

        smsData

      );



    console.log(
      "SMS Response:",
      response.data
    );


    return response.data;



  } catch(error) {


    console.error(
      "SMS Send Error:",
      error
    );


    return null;


  }


}