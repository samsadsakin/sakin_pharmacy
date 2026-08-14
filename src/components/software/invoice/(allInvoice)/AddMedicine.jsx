"use client";


import {
  Input,
} from "./InvoiceUtils";



export default function AddMedicine({
  item,
  updateItem,
  addMedicine,
}){


return (

<section>


<h3 className="mb-3 text-sm font-semibold text-slate-700">
Add Medicine
</h3>


<div className="rounded-xl bg-sky-50 p-4">


<Input

name="medicine"

placeholder="Medicine"

value={
  item.medicine
}

onChange={
  updateItem
}

/>



<div className="mt-3 grid grid-cols-3 gap-3">


<Input

type="number"

name="qty"

placeholder="Qty"

value={
 item.qty
}

onChange={
 updateItem
}

/>



<Input

type="number"

name="rate"

placeholder="Rate"

value={
 item.rate
}

onChange={
 updateItem
}

/>



<Input

type="number"

name="dis"

placeholder="Dis %"

value={
 item.dis
}

onChange={
 updateItem
}

/>



</div>



<button

type="button"

onClick={
 addMedicine
}

className="mt-3 w-full rounded-lg bg-emerald-700 py-2.5 text-sm font-medium text-white"

>

+ Add Medicine

</button>



</div>


</section>

);


}