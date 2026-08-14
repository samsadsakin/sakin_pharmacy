"use client";


import {
  LockedField,
} from "./InvoiceUtils";



export default function CalculationBox({

  total,

  discount,

  payable,

  setPayable,

}) {



const money = (value)=>

Number(
  value || 0
).toFixed(2);



return (


<div className="rounded-xl bg-slate-50 p-4">


<h3 className="mb-4 text-sm font-semibold text-sky-800">

Calculation

</h3>



<div className="space-y-3">



<LockedField

label="Total"

value={
  money(total)
}

/>




<LockedField

label="Discount"

value={
  money(discount)
}

/>





<div className="flex items-center justify-between gap-4">


<span className="text-sm font-semibold text-slate-700">

Payable Amount

</span>




<input

type="number"

min="0"

max={total}

value={payable}

placeholder={money(total)}

onChange={(e)=>

setPayable(
  e.target.value
)

}

className="w-32 rounded-lg bg-white px-3 py-2 text-right text-sm font-semibold text-sky-800 outline-none ring-1 ring-sky-200 focus:ring-sky-400"

/>



</div>




</div>


</div>


);


}