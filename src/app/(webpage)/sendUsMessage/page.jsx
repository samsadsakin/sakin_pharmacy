"use client";

import {
  useState,
} from "react";

import {
  FaWhatsapp,
  FaPaperPlane,
  FaCheckCircle,
  FaComments,
  FaClock,
  FaShieldAlt,
} from "react-icons/fa";


export default function ContactPage() {

  const WHATSAPP_NUMBER =
    "8801XXXXXXXXX";


  const [
    message,
    setMessage,
  ] = useState(
    "Hello Sakin Pharmacy, I would like to get some information."
  );


  // =========================
  // SEND WHATSAPP
  // =========================

  const handleSendMessage = () => {

    const cleanMessage =
      message.trim();


    if (!cleanMessage) {
      return;
    }


    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        cleanMessage
      )}`;


    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

  };


  return (

    <main className="min-h-[78vh] bg-gradient-to-br from-emerald-50/60 via-white to-sky-50/70 px-4 py-8 sm:py-12 lg:flex lg:items-center lg:py-16">


      <div className="mx-auto w-full max-w-6xl">


        <div className="grid items-stretch gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">


          {/* =========================
              DESKTOP INFO BANNER
              HIDDEN ON MOBILE
          ========================= */}

          <div className="hidden lg:block">


            <div className="flex h-full flex-col justify-between rounded-[2rem] bg-gradient-to-br from-[#0b4a37] via-[#0b5b41] to-[#08781F] p-9 text-white shadow-[0_25px_70px_rgba(8,120,31,0.18)]">


              <div>


                <div className="flex size-16 items-center justify-center rounded-2xl bg-white/12 backdrop-blur">

                  <FaWhatsapp className="text-4xl" />

                </div>


                <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-100">

                  Sakin Pharmacy Support

                </p>


                <h1 className="mt-3 text-4xl font-bold leading-tight">

                  We&apos;re only a message away.

                </h1>


                <p className="mt-5 max-w-md text-base leading-7 text-emerald-50/90">

                  Send us your question through WhatsApp and our team will be
                  ready to assist you with the information you need.

                </p>


                <div className="mt-8 space-y-4">


                  <InfoItem
                    icon={FaComments}
                    title="Easy Communication"
                    text="Send your message directly through WhatsApp."
                  />


                  <InfoItem
                    icon={FaClock}
                    title="Quick Support"
                    text="A simple way to reach our pharmacy team."
                  />


                  <InfoItem
                    icon={FaShieldAlt}
                    title="Private Conversation"
                    text="Your conversation continues securely inside WhatsApp."
                  />


                </div>


              </div>


              <div className="mt-10 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">

                <p className="text-sm leading-6 text-emerald-50">

                  Need help with a product, availability, or general inquiry?
                  Write your message and continue on WhatsApp.

                </p>

              </div>


            </div>


          </div>


          {/* =========================
              MESSAGE CARD
          ========================= */}

          <div className="rounded-[2rem] bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8 lg:p-10">


            {/* =========================
                SMALL INFO
            ========================= */}

            <div className="flex items-center justify-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-center text-sm font-medium text-emerald-700 sm:mx-auto sm:w-fit">

              <FaCheckCircle className="shrink-0" />

              Quick support through WhatsApp

            </div>


            {/* =========================
                ICON
            ========================= */}

            <div className="mx-auto mt-5 flex size-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-emerald-50 to-green-100 text-[#08781F] shadow-sm sm:size-24">

              <FaWhatsapp className="text-5xl sm:text-6xl" />

            </div>


            {/* =========================
                HEADING
            ========================= */}

            <div className="mx-auto mt-5 max-w-xl text-center">


              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#08781F] sm:text-base">

                WhatsApp Support

              </p>


              <h2 className="mt-2 text-3xl font-bold leading-tight text-slate-800 sm:text-4xl">

                Send Us a Message

              </h2>


              <p className="mt-3 text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">

                Tell us how we can help. Write your message below and continue
                the conversation directly on WhatsApp.

              </p>


            </div>


            {/* =========================
                MESSAGE FIELD
            ========================= */}

            <div className="mt-7 sm:mt-8">


              <div className="mb-2 flex items-center justify-between gap-3">


                <label className="text-base font-semibold text-slate-700 sm:text-lg">

                  Your Message

                </label>


                <span className="text-xs text-slate-400 sm:text-sm">

                  {message.length} characters

                </span>


              </div>


              <textarea
                value={
                  message
                }
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                placeholder="Write your message here..."
                rows={6}
                className="textarea w-full resize-none rounded-2xl bg-slate-50 p-4 text-base leading-7 text-slate-700 shadow-inner outline-none transition focus:bg-white focus:ring-2 focus:ring-emerald-100 sm:p-5 sm:text-lg"
              />


              <p className="mt-2 text-sm leading-6 text-slate-400">

                You can review and edit your message before sending it.

              </p>


            </div>


            {/* =========================
                BUTTON
            ========================= */}

            <button
              type="button"
              onClick={
                handleSendMessage
              }
              disabled={
                !message.trim()
              }
              className="mt-6 flex min-h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#0b7a35] to-[#159447] px-5 text-base font-bold text-white shadow-[0_12px_30px_rgba(21,148,71,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(21,148,71,0.28)] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-16 sm:text-lg"
            >


              <FaWhatsapp className="text-2xl sm:text-3xl" />


              Continue on WhatsApp


              <FaPaperPlane className="text-sm opacity-80 sm:text-base" />


            </button>


            {/* =========================
                BOTTOM NOTE
            ========================= */}

            <div className="mt-5 rounded-2xl bg-gradient-to-r from-slate-50 to-emerald-50/60 px-4 py-4 text-center sm:px-6">


              <p className="text-sm leading-6 text-slate-500 sm:text-base">

                WhatsApp will open with your message ready. Review it and tap
                send when you&apos;re ready.

              </p>


            </div>


          </div>


        </div>


      </div>


    </main>

  );

}


// =========================
// DESKTOP INFO ITEM
// =========================

function InfoItem({
  icon: Icon,
  title,
  text,
}) {

  return (

    <div className="flex items-start gap-3">


      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">

        <Icon className="text-emerald-100" />

      </div>


      <div>

        <p className="font-semibold">

          {title}

        </p>


        <p className="mt-1 text-sm leading-6 text-emerald-50/80">

          {text}

        </p>

      </div>


    </div>

  );

}