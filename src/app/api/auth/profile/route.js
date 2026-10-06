import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import UserProfile from "@/models/userProfile";
import User from "@/models/user";
import { verifySessionToken } from "@/lib/auth";

export const runtime = "nodejs";

// =========================
// GET USER PROFILE(S)
// =========================
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("customer_session")?.value;

    if (!token) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return Response.json(
        { success: false, message: "Invalid session" },
        { status: 401 }
      );
    }

    await connectDB();

    const currentUser = await User.findById(session.userId).lean();
    if (!currentUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isAdminOrManager = ["admin", "manager"].includes(currentUser.role);

    if (isAdminOrManager) {
      const allUserProfiles = await UserProfile.find({}).lean();

      return Response.json({
        success: true,
        isAdminOrManager: true,
        profiles: allUserProfiles,
      });
    }

    const profile = await UserProfile.findOne({ userId: session.userId }).lean();
    return Response.json({
      success: true,
      isAdminOrManager: false,
      profile: profile || {
        userId: session.userId,
        name: currentUser.name || "",
        mobile: currentUser.mobile || "",
        role: currentUser.role || "customer",
        staffVerified: currentUser.staffVerified || false,
        address: "",
        image: "",
        nidFront: "",
        nidBack: "",
      },
    });
  } catch (error) {
    console.error("GET Profile Error:", error);
    return Response.json(
      { success: false, message: "Failed to get profile" },
      { status: 500 }
    );
  }
}

// =========================
// SAVE / UPDATE PROFILE
// =========================
export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("customer_session")?.value;

    if (!token) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return Response.json(
        { success: false, message: "Invalid session" },
        { status: 401 }
      );
    }

    await connectDB();

    const currentUser = await User.findById(session.userId).lean();
    if (!currentUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { userId: targetUserId, name, mobile, role, staffVerified, address, image, nidFront, nidBack } = body;

    const isAdminOrManager = ["admin", "manager"].includes(currentUser.role);
    const finalUserId = isAdminOrManager && targetUserId ? targetUserId : session.userId;

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: finalUserId },
      {
        $set: {
          userId: finalUserId,
          name: name ? name.trim() : "",
          mobile: mobile ? mobile.trim() : "",
          role: role || "customer",
          staffVerified: staffVerified || false,
          address: address ? address.trim() : "",
          image: image || "",
          nidFront: nidFront || "",
          nidBack: nidBack || "",
        },
      },
      { new: true, upsert: true }
    );

    return Response.json({
      success: true,
      message: "UserProfile collection-e data successfully update hoise!",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Save Profile Error:", error);
    return Response.json(
      { success: false, message: error?.message || "Failed to save profile" },
      { status: 500 }
    );
  }
}

// =========================
// DELETE USER PROFILE (Admin/Manager Only)
// =========================
export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("customer_session")?.value;

    if (!token) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return Response.json(
        { success: false, message: "Invalid session" },
        { status: 401 }
      );
    }

    await connectDB();

    const currentUser = await User.findById(session.userId).lean();
    if (!currentUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Role check: Only admin or manager can delete profiles
    const isAdminOrManager = ["admin", "manager"].includes(currentUser.role);
    if (!isAdminOrManager) {
      return Response.json(
        { success: false, message: "Forbidden: Only admin or manager can delete profile" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("userId");

    if (!targetUserId) {
      return Response.json(
        { success: false, message: "Target userId is required" },
        { status: 400 }
      );
    }

    await UserProfile.findOneAndDelete({ userId: targetUserId });

    return Response.json({
      success: true,
      message: "UserProfile document delete hoye geche!",
    });
  } catch (error) {
    console.error("Delete Profile Error:", error);
    return Response.json(
      { success: false, message: error?.message || "Failed to delete profile" },
      { status: 500 }
    );
  }
}