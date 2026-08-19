"use client";

import { useState } from "react";

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
    "8801540553900";


  const [message, setMessage] =
    useState(
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

    <main className="min-h-[78vh] bg-emerald-50 px-4 py-8 sm:py-12 lg:flex lg:items-center lg:py-16">


      <div className="mx-auto w-full max-w-6xl">


        <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">


          {/* =========================
              DESKTOP BANNER
              MOBILE HIDDEN
          ========================= */}

          <div className="hidden lg:block">


            <div className="flex h-full flex-col justify-between rounded-3xl bg-emerald-800 p-9 text-white shadow-xl">


              <div>


                {/* ICON */}

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-700">

                  <FaWhatsapp className="text-4xl" />

                </div>


                {/* CONTENT */}

                <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-emerald-200">

                  Sakin Pharmacy Support

                </p>


                <h1 className="mt-3 text-4xl font-bold leading-tight">

                  We&apos;re only a
                  <br />
                  message away.

                </h1>


                <p className="mt-5 max-w-md text-base leading-7 text-emerald-100">

                  Have a question or need assistance?
                  Reach out to Sakin Pharmacy directly
                  through WhatsApp and our team will be
                  happy to assist you.

                </p>


                {/* INFO ITEMS */}

                <div className="mt-9 space-y-5">


                  <InfoItem
                    icon={FaComments}
                    title="Easy Communication"
                    text="Send your question directly through WhatsApp."
                  />


                  <InfoItem
                    icon={FaClock}
                    title="Quick & Convenient"
                    text="A simple way to get in touch with our pharmacy team."
                  />


                  <InfoItem
                    icon={FaShieldAlt}
                    title="Private Conversation"
                    text="Your conversation continues directly inside WhatsApp."
                  />


                </div>


              </div>


              {/* BOTTOM INFO */}

              <div className="mt-10 rounded-2xl bg-emerald-700 p-5">


                <p className="text-sm leading-6 text-emerald-50">

                  Need information about a product,
                  availability, or any general inquiry?
                  Simply write your message and continue
                  on WhatsApp.

                </p>


              </div>


            </div>


          </div>


          {/* =========================
              MESSAGE CARD
          ========================= */}

          <div className="rounded-3xl bg-white p-5 shadow-xl sm:p-8 lg:p-10">


            {/* =========================
                TOP INFO
            ========================= */}

            <div className="mx-auto flex w-fit items-center justify-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-center text-sm font-medium text-emerald-700">


              <FaCheckCircle />


              Quick support through WhatsApp


            </div>


            {/* =========================
                WHATSAPP ICON
            ========================= */}

            <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-emerald-700 shadow-sm sm:h-24 sm:w-24">


              <FaWhatsapp className="text-5xl sm:text-6xl" />


            </div>


            {/* =========================
                HEADING
            ========================= */}

            <div className="mx-auto mt-5 max-w-xl text-center">


              <p className="text-sm font-bold uppercase tracking-widest text-emerald-700 sm:text-base">

                WhatsApp Support

              </p>


              <h2 className="mt-2 text-3xl font-bold leading-tight text-slate-800 sm:text-4xl">

                Send Us a Message

              </h2>


              <p className="mt-3 text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">

                Tell us how we can help. Write your
                message below and continue directly
                to WhatsApp.

              </p>


            </div>


            {/* =========================
                MESSAGE FIELD
            ========================= */}

            <div className="mt-8">


              <div className="mb-2 flex items-center justify-between gap-3">


                <label className="text-base font-semibold text-slate-700 sm:text-lg">

                  Your Message

                </label>


                <span className="text-xs text-slate-400 sm:text-sm">

                  {message.length} characters

                </span>


              </div>


              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                placeholder="Write your message here..."
                rows={6}
                className="textarea w-full resize-none rounded-2xl bg-slate-50 p-4 text-base leading-7 text-slate-700 shadow-inner outline-none transition focus:bg-white focus:ring-2 focus:ring-emerald-200 sm:p-5 sm:text-lg"
              />


              <p className="mt-2 text-sm leading-6 text-slate-400">

                You can review and edit your message
                before continuing.

              </p>


            </div>


            {/* =========================
                BUTTON
            ========================= */}

            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="mt-6 flex min-h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-emerald-700 px-5 text-base font-bold text-white shadow-lg transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-16 sm:text-lg"
            >


              <FaWhatsapp className="text-2xl sm:text-3xl" />


              Continue on WhatsApp


              <FaPaperPlane className="text-sm opacity-80 sm:text-base" />


            </button>


            {/* =========================
                BOTTOM NOTE
            ========================= */}

            <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-4 text-center sm:px-6">


              <p className="text-sm leading-6 text-slate-500 sm:text-base">

                WhatsApp will open with your message
                ready. Review it and tap send whenever
                you&apos;re ready.

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

    <div className="flex items-start gap-4">


      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700">

        <Icon className="text-emerald-100" />

      </div>


      <div>

        <p className="font-semibold text-white">

          {title}

        </p>


        <p className="mt-1 text-sm leading-6 text-emerald-100">

          {text}

        </p>


      </div>


    </div>

  );

}