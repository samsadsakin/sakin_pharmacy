"use client";


import {
  CheckBox,
  OptionButton,
} from "./InvoiceUtils";



export default function InvoiceOptions({

  options,

  setOptions,

}) {



const updateOption = (
  field,
  value
)=>{


setOptions({

  ...options,

  [field]:
    value,

});


};



return (


<div className="mt-3 rounded-xl bg-sky-50 p-4">


<h3 className="mb-3 text-sm font-semibold text-sky-800">

Invoice Options

</h3>




<div className="flex flex-wrap items-center gap-5">



{/* SMS */}

<CheckBox

label="SMS"

checked={
  options.sms
}

onChange={(checked)=>

updateOption(
  "sms",
  checked
)

}

/>





{/* SHORT LONG */}

{

options.sms && (


<div className="flex rounded-lg bg-white p-1">



<OptionButton

active={
  options.smsType === "short"
}

onClick={()=>


updateOption(
  "smsType",
  "short"
)


}

>

Short

</OptionButton>





<OptionButton

active={
  options.smsType === "long"
}

onClick={()=>


updateOption(
  "smsType",
  "long"
)


}

>

Long

</OptionButton>





</div>


)

}







{/* PRINT */}

<CheckBox

label="Print"

checked={
  options.print
}

onChange={(checked)=>

updateOption(
  "print",
  checked
)

}

/>






{/* PAID */}

<CheckBox

label="Paid"

checked={
  options.paid
}

onChange={(checked)=>

updateOption(
  "paid",
  checked
)

}

/>





</div>


</div>


);


}