"use client";


export default function InvoiceFilter({

  today,

  isTodayActive,

  fromDate,

  toDate,

  invoiceSearch,

  setFromDate,

  setToDate,

  setInvoiceSearch,

  onToday,

  onClear,

}) {



const handleSearch = (e)=>{


const value =
e.target.value.replace(
  /\D/g,
  ""
);


setInvoiceSearch(
  value
);


};





return (


<div className="mb-5 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">


<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">






{/* TODAY */}


<div className="flex items-end">


<button

type="button"

onClick={onToday}

className={`btn w-full ${
isTodayActive
?
"btn-info text-white"
:
"btn-outline btn-info"
}`}

>


Today


</button>


</div>








{/* FROM DATE */}


<div>


<label className="mb-1 block text-xs font-semibold text-slate-500">

From Date

</label>


<input

type="date"

value={fromDate}

onChange={(e)=>

setFromDate(
e.target.value
)

}

max={
toDate || undefined
}

disabled={
Boolean(invoiceSearch)
}

className="input input-bordered w-full"

/>


</div>









{/* TO DATE */}


<div>


<label className="mb-1 block text-xs font-semibold text-slate-500">

To Date

</label>


<input

type="date"

value={toDate}

onChange={(e)=>

setToDate(
e.target.value
)

}

min={
fromDate || undefined
}

disabled={
Boolean(invoiceSearch)
}

className="input input-bordered w-full"

/>


</div>









{/* SEARCH */}


<div>


<label className="mb-1 block text-xs font-semibold text-slate-500">

Search Invoice No

</label>


<input

type="text"

inputMode="numeric"

value={invoiceSearch}

onChange={handleSearch}

placeholder="Invoice No"

className="input input-bordered w-full"

/>


</div>








{/* CLEAR */}


<div className="flex items-end">


<button

type="button"

onClick={onClear}

disabled={
!fromDate &&
!toDate &&
!invoiceSearch
}

className="btn btn-outline w-full"

>


Clear Filter


</button>


</div>





</div>







{/* STATUS */}


<div className="mt-3 text-xs text-slate-500">


{

invoiceSearch ? (

<span>

Searching Invoice:

<strong className="ml-1 text-sky-700">

#{invoiceSearch}

</strong>


</span>


) : isTodayActive ? (


<span>

Showing Today's Invoice ({today})

</span>


) : fromDate || toDate ? (


<span>

Date:

<strong className="ml-1 text-sky-700">

{fromDate || "Beginning"}

{" → "}

{toDate || "Latest"}

</strong>


</span>


) : (


<span>

Showing latest invoices

</span>


)

}


</div>




</div>


);


}