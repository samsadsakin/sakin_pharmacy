export function createInvoiceSMS(data) {


  let medicineText = "";


  if(data.medicines?.length){

    medicineText =
      data.medicines
      .map(
        (item)=>
          `${item.medicine}-${item.qty}x${item.rate}=${item.amount}`
      )
      .join(",");

  }



  // LONG SMS

  if(data.options?.smsType === "long"){



    let paymentText =
      data.options?.paid

      ?

      `পরিশোধ:${data.payableAmount}Tk`

      :

      `বাকি:${data.payableAmount}Tk`;



    return (
      `#Inv-${data.invoiceNo},` +
      `${medicineText},` +
      `Total:${data.total}Tk,` +
      `${paymentText}` +
      `~Sakin Pharmacy`
    );


  }







  // SHORT SMS


  if(data.options?.paid){


    return (
      `#Inv-${data.invoiceNo}: ` +
      `আপনি ${data.payableAmount} টাকার ঔষধ ক্রয় করেছেন।~Sakin Pharmacy`
    );


  }


  else{


    return (
      `#Inv-${data.invoiceNo}: ` +
      `ঔষধ ক্রয়। বাকি ${data.payableAmount} টাকা।~Sakin Pharmacy`
    );


  }



}