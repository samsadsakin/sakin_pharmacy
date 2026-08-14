"use client";


export default function InvoiceHeader({

  invoiceNo,

  date,

  seller,

  invoiceType,

  setInvoiceType,

}) {


return (

<div className="mb-6 rounded-xl bg-sky-50 p-4">


<div className="grid gap-4 md:grid-cols-4">



{/* Invoice No */}

<div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">


<p className="text-xs text-slate-400">
Invoice No
</p>


<p className="mt-1 text-sm font-semibold text-sky-700">

{invoiceNo || "-"}

</p>


</div>






{/* Date */}

<div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">


<p className="text-xs text-slate-400">
Date
</p>


<p className="mt-1 text-sm font-semibold text-slate-700">

{date || "-"}

</p>


</div>







{/* Seller Name */}

<div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">


<p className="text-xs text-slate-400">
Seller Name
</p>


<p className="mt-1 text-sm font-semibold text-emerald-700">

{seller?.name || "-"}

</p>


</div>







{/* Invoice Type */}

<div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">


<p className="text-xs text-slate-400">
Invoice Type
</p>



<select

value={invoiceType}

onChange={(e)=>

setInvoiceType(
e.target.value
)

}

className="mt-1 w-full bg-transparent text-sm font-semibold text-slate-700 outline-none"

>


<option value="regular">

Regular

</option>


<option value="kemo">

Kemo

</option>


</select>



</div>





</div>


</div>

);


}