"use client";


export default function SaveInvoiceButton({

  onClick,

  disabled,

}) {



return (


<button

type="button"

onClick={onClick}

disabled={disabled}

className="mt-3 w-full rounded-lg bg-sky-700 py-2.5 text-sm font-semibold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-40"

>


Save Invoice


</button>


);


}