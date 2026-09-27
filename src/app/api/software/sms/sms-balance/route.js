import { NextResponse } from "next/server";


export async function GET() {

  try {

    // =========================
    // TOKEN
    // =========================

    const token =
      process.env.BD_BULK_SMS_Balance_TOKEN;


    if (!token) {

      return NextResponse.json(
        {
          success: false,
          message:
            "SMS token not configured",
        },
        {
          status: 500,
        }
      );

    }


    // =========================
    // BALANCE API
    // =========================

    const balanceUrl =
      `https://api.bdbulksms.net/g_api.php?token=${token}&balance`;


    const balanceResponse =
      await fetch(
        balanceUrl,
        {
          cache: "no-store",
        }
      );


    if (!balanceResponse.ok) {

      throw new Error(
        `Balance API Error: ${balanceResponse.status}`
      );

    }


    const balanceResult =
      await balanceResponse.text();


    // Remove HTML tags
    const cleanBalance =
      balanceResult
        .replace(/<[^>]*>/g, "")
        .trim();


    const balance =
      Number(cleanBalance);


    if (Number.isNaN(balance)) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Invalid balance received",

          raw: balanceResult,

          cleaned: cleanBalance,
        },
        {
          status: 500,
        }
      );

    }


    // =========================
    // EXPIRY API
    // =========================

    const expiryUrl =
      `https://api.bdbulksms.net/g_api.php?token=${token}&expiry`;


    const expiryResponse =
      await fetch(
        expiryUrl,
        {
          cache: "no-store",
        }
      );


    if (!expiryResponse.ok) {

      throw new Error(
        `Expiry API Error: ${expiryResponse.status}`
      );

    }


    const expiryResult =
      await expiryResponse.text();


    // Remove HTML tags
    const expiry =
      expiryResult
        .replace(/<[^>]*>/g, "")
        .trim();


    // =========================
    // FINAL RESPONSE
    // =========================

    return NextResponse.json({

      success: true,

      balance: balance,

      expiry: expiry,

    });


  } catch (error) {

    console.error(
      "SMS API Error:",
      error
    );


    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to fetch SMS information",
      },
      {
        status: 500,
      }
    );

  }

}