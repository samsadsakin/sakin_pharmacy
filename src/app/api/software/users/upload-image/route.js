export const runtime = "nodejs";

export async function POST(request) {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          success: false,
          message: "IMGBB_API_KEY পাওয়া যায়নি। .env.local ফাইলে কি সেভ করেছেন?",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!image) {
      return Response.json(
        {
          success: false,
          message: "ছবি সিলেক্ট করা হয়নি",
        },
        { status: 400 }
      );
    }

    if (!image.type?.startsWith("image/")) {
      return Response.json(
        {
          success: false,
          message: "শুধু ইমেজ ফাইল আপলোড করা যাবে",
        },
        { status: 400 }
      );
    }

    if (image.size > 5 * 1024 * 1024) {
      return Response.json(
        {
          success: false,
          message: "ছবিটি ৫ মেগাবাইটের (5MB) চেয়ে ছোট হতে হবে",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const base64 = buffer.toString("base64");

    // ImgBB API-তে পাঠানোর জন্য Form Data তৈরি
    const imgbbFormData = new FormData();
    imgbbFormData.append("image", base64);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: imgbbFormData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error("IMGBB ERROR:", result);
      return Response.json(
        {
          success: false,
          message: result?.error?.message || "ছবি আপলোড ব্যর্থ হয়েছে",
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      url: result.data.url,
      displayUrl: result.data.display_url,
      deleteUrl: result.data.delete_url,
    });
  } catch (error) {
    console.error("IMAGE UPLOAD ERROR:", error);
    return Response.json(
      {
        success: false,
        message: error?.message || "ছবি আপলোডে কোনো সমস্যা হয়েছে",
      },
      { status: 500 }
    );
  }
}