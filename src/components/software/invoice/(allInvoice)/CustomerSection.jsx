"use client";


import {
  Field,
} from "./InvoiceUtils";



export default function CustomerSection({

  customer,

  setCustomer,

}) {


return (

<section className="mb-6 space-y-3">



<div className="grid gap-3 md:grid-cols-2">



{/* Name */}

<Field

label="Name"

placeholder="Customer Name"

value={
  customer.name
}

onChange={(e)=>

setCustomer({

...customer,

name:
e.target.value,

})

}

/>





{/* More Info */}

<Field

label="More Info"

placeholder="More Information"

value={
 customer.moreInfo
}

onChange={(e)=>

setCustomer({

...customer,

moreInfo:
e.target.value,

})

}

/>



</div>





{/* Phone */}

<Field

label="Phone Number"

placeholder="Phone Number"

value={
 customer.phone
}

onChange={(e)=>

setCustomer({

...customer,

phone:
e.target.value,

})

}

/>



</section>

);


}