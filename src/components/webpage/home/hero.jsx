export default function PharmacyHero() {
  return (
    <section className="bg-white overflow-hidden">

      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">


        <div className="grid items-center gap-12 lg:grid-cols-2">


          {/* LEFT */}

          <div>


            {/* Small Badge */}

            <div className="mb-5 inline-flex rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">

              Trusted Healthcare Partner

            </div>




            {/* Pharmacy Name */}

            <h1 className="
              text-4xl
              font-bold
              leading-tight
              text-slate-800
              sm:text-5xl
            ">

              Sakin Pharmacy

              <br />

              <span className="text-[#08781F]">
                Your Health, Our Care
              </span>

            </h1>





            <p className="
              mt-5
              max-w-lg
              text-base
              leading-relaxed
              text-slate-500
            ">

              Providing genuine medicines, healthcare products,
              and reliable pharmacy services with affordable prices
              for your everyday health needs.

            </p>





            {/* Button */}

            <div className="mt-8">

              <button
                className="
                rounded-lg
                bg-[#08781F]
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                hover:bg-[#066617]
                "
              >

                Explore Medicines

              </button>

            </div>





            {/* Small Trust */}

            <div className="mt-10 flex flex-wrap gap-8">


              <div>

                <p className="text-xl font-bold text-slate-800">
                  10K+
                </p>

                <p className="text-sm text-slate-500">
                  Medicines
                </p>

              </div>




              <div>

                <p className="text-xl font-bold text-slate-800">
                  100%
                </p>

                <p className="text-sm text-slate-500">
                  Genuine Products
                </p>

              </div>





              <div>

                <p className="text-xl font-bold text-slate-800">
                  Fair
                </p>

                <p className="text-sm text-slate-500">
                  Pricing
                </p>

              </div>


            </div>



          </div>







          {/* RIGHT IMAGE */}


          <div className="flex justify-center">


            <div className="relative">


              {/* Soft Background */}

              <div
                className="
                absolute
                inset-0
                -rotate-3
                rounded-3xl
                bg-green-100
                "
              />



              <img
                src="/images/pharmacy.jpg"
                alt="Sakin Pharmacy"
                className="
                relative
                z-10
                w-[420px]
                rounded-3xl
                shadow-xl
                "
              />





              {/* Info Card */}

              <div
                className="
                absolute
                bottom-5
                left-5
                z-20
                rounded-xl
                bg-white
                px-5
                py-4
                shadow-lg
                "
              >

                <p className="text-xs text-slate-400">
                  Quality Medicine
                </p>


                <p className="font-semibold text-slate-800">
                  Trusted Since Years
                </p>


              </div>



            </div>


          </div>


        </div>








        {/* FEATURES */}


        <div className="
          mt-20
          grid
          gap-5
          sm:grid-cols-3
        ">



          <InfoCard
            title="Authentic Medicines"
            text="Carefully selected medicines from trusted sources."
          />


          <InfoCard
            title="Affordable Price"
            text="Quality healthcare products at reasonable prices."
          />


          <InfoCard
            title="Professional Service"
            text="Friendly pharmacy service for every customer."
          />


        </div>



      </div>


    </section>
  );
}





function InfoCard({
  title,
  text
}) {

  return (

    <div
      className="
      rounded-2xl
      border
      border-slate-100
      bg-white
      p-6
      "
    >

      <h3 className="
        font-semibold
        text-slate-800
      ">

        {title}

      </h3>


      <p className="
        mt-2
        text-sm
        leading-relaxed
        text-slate-500
      ">

        {text}

      </p>


    </div>

  );

}