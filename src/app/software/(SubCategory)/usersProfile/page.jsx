"use client";

import { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaPhone,
  FaUserShield,
  FaCheckCircle,
  FaSpinner,
  FaCamera,
  FaIdCard,
  FaMapMarkerAlt,
  FaSave,
  FaTrashAlt,
  FaTimes,
  FaSearchPlus,
  FaUserPlus,
} from "react-icons/fa";

export default function UserProfilePage() {
  const [isAdminOrManager, setIsAdminOrManager] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [singleProfile, setSingleProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadingState, setUploadingState] = useState({});
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // =========================
  // ADD NEW PROFILE MODAL STATE
  // =========================
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({
    userId: "",
    name: "",
    mobile: "",
    role: "salesman",
    staffVerified: false,
    address: "",
    image: "",
    nidFront: "",
    nidBack: "",
  });
  const [creating, setCreating] = useState(false);

  // =========================
  // LOAD USERPROFILE DATA
  // =========================
  const loadProfilesData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/profile", { cache: "no-store" });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAdminOrManager(data.isAdminOrManager);
        if (data.isAdminOrManager) {
          setProfiles(data.profiles || []);
        } else {
          setSingleProfile(data.profile || null);
        }
      } else {
        setError(data.message || "UserProfile data load kora shombhob hoyni.");
      }
    } catch (err) {
      console.error("Profile Load Error:", err);
      setError("Network error. UserProfile data load kora jayni.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfilesData();
  }, []);

  // =========================
  // FILE UPLOAD (IMGBB)
  // =========================
  const handleFileUpload = async (file, fieldType, targetUserId) => {
    if (!file) return;

    try {
      setUploadingState((prev) => ({ ...prev, [`${targetUserId}_${fieldType}`]: true }));

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/software/users/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const imageUrl = data.displayUrl || data.url;

        if (targetUserId === "new") {
          setNewProfile((prev) => ({ ...prev, [fieldType]: imageUrl }));
        } else if (isAdminOrManager) {
          setProfiles((prev) =>
            prev.map((p) => (p.userId === targetUserId ? { ...p, [fieldType]: imageUrl } : p))
          );
        } else {
          setSingleProfile((prev) => ({ ...prev, [fieldType]: imageUrl }));
        }
      } else {
        alert(data.message || "Chobi upload kora shombhob hoyni.");
      }
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Chobi upload korar shomoy error hoyeche.");
    } finally {
      setUploadingState((prev) => ({ ...prev, [`${targetUserId}_${fieldType}`]: false }));
    }
  };

  // =========================
  // SAVE / UPDATE PROFILE
  // =========================
  const handleSaveInfo = async (profileData) => {
    try {
      setSavingId(profileData.userId);

      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("UserProfile collection-e data successfully update hoyeche!");
      } else {
        alert(data.message || "Tathya save kora shombhob hoyni.");
      }
    } catch (err) {
      console.error("Save Profile Error:", err);
      alert("Data save korar shomoy problem hoyeche.");
    } finally {
      setSavingId(null);
    }
  };

  // =========================
  // CREATE NEW PROFILE SUBMISSION
  // =========================
  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!newProfile.userId || !newProfile.mobile) {
      alert("User ID ebong Mobile Number deya mandatory!");
      return;
    }

    try {
      setCreating(true);

      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProfile),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Notun UserProfile successfuly add kora hoyeche!");
        setIsAddModalOpen(false);
        setNewProfile({
          userId: "",
          name: "",
          mobile: "",
          role: "customer",
          staffVerified: false,
          address: "",
          image: "",
          nidFront: "",
          nidBack: "",
        });
        await loadProfilesData();
      } else {
        alert(data.message || "Notun profile create kora jaini.");
      }
    } catch (err) {
      console.error("Create Profile Error:", err);
      alert("Error creating profile.");
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // DELETE PROFILE
  // =========================
  const handleDeleteProfile = async (targetUserId) => {
    const isConfirmed = window.confirm("Apni ki shotti ei userProfile-ti delete korte chan?");
    if (!isConfirmed) return;

    try {
      setDeletingId(targetUserId);

      const res = await fetch(`/api/auth/profile?userId=${targetUserId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("UserProfile successfully delete hoye geche!");
        await loadProfilesData();
      } else {
        alert(data.message || "Delete kora shombhob hoyni.");
      }
    } catch (err) {
      console.error("Delete Profile Error:", err);
      alert("Profile delete korar shomoy problem hoyeche.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleInputChange = (userId, field, value) => {
    if (isAdminOrManager) {
      setProfiles((prev) =>
        prev.map((p) => (p.userId === userId ? { ...p, [field]: value } : p))
      );
    } else {
      setSingleProfile((prev) => ({ ...prev, [field]: value }));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-slate-500">
        <FaSpinner className="mb-3 size-8 animate-spin text-sky-600" />
        <p className="text-sm font-medium">UserProfile collection load hochhe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto my-10 max-w-lg rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-bold text-red-600">{error}</p>
      </div>
    );
  }

  const profileList = isAdminOrManager ? profiles : singleProfile ? [singleProfile] : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      {/* TOP CONTROL PANEL */}
      {isAdminOrManager && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-sky-50 p-4 border border-sky-200">
          <div className="text-sky-800 text-sm font-bold">
            UserProfile Database Collection ({profiles.length} Profiles) - Admin/Manager Control Panel
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-sky-700"
          >
            <FaUserPlus /> Add New Profile
          </button>
        </div>
      )}

      {/* PC TE 2 COLUMN GRID CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {profileList.map((item) => (
          <div key={item.userId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md flex flex-col justify-between">
            <div>
              {/* HEADER COVER */}
              <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-6 text-white">
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    <div
                      onClick={() => item.image && setSelectedImage(item.image)}
                      className={`flex size-20 items-center justify-center overflow-hidden rounded-full border-2 border-white/50 bg-white/20 text-2xl font-bold uppercase backdrop-blur-md ${
                        item.image ? "cursor-pointer hover:opacity-90" : ""
                      }`}
                    >
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="size-full object-cover" />
                      ) : item.name ? (
                        item.name.charAt(0)
                      ) : (
                        "U"
                      )}
                    </div>

                    <label
                      htmlFor={`profile-image-${item.userId}`}
                      className="absolute bottom-0 right-0 flex size-7 cursor-pointer items-center justify-center rounded-full bg-slate-900/80 text-white transition hover:bg-slate-900"
                    >
                      {uploadingState[`${item.userId}_image`] ? (
                        <FaSpinner className="animate-spin text-xs" />
                      ) : (
                        <FaCamera className="text-xs" />
                      )}
                    </label>

                    <input
                      id={`profile-image-${item.userId}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], "image", item.userId)}
                      disabled={uploadingState[`${item.userId}_image`]}
                      className="hidden"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">{item.name || "User Profile"}</h2>
                    <p className="text-xs text-sky-100 capitalize">Role: {item.role || "Staff"}</p>
                  </div>
                </div>
              </div>

              {/* FORM */}
              <div className="space-y-4 p-6">
                {/* FULL NAME */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700">
                    <FaUserCircle className="text-sky-600" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleInputChange(item.userId, "name", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 focus:border-sky-600 focus:outline-none"
                  />
                </div>

                {/* MOBILE NUMBER */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700">
                    <FaPhone className="text-sky-600" />
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={item.mobile}
                    onChange={(e) => handleInputChange(item.userId, "mobile", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 focus:border-sky-600 focus:outline-none"
                  />
                </div>

                {/* ADDRESS */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700">
                    <FaMapMarkerAlt className="text-sky-600" />
                    Address
                  </label>
                  <input
                    type="text"
                    value={item.address}
                    onChange={(e) => handleInputChange(item.userId, "address", e.target.value)}
                    placeholder="Address..."
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 focus:border-sky-600 focus:outline-none"
                  />
                </div>

                {/* ROLE & STATUS */}
                <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700">
                      <FaUserShield className="text-sky-600" />
                      Role
                    </label>
                    <input
                      type="text"
                      value={item.role}
                      onChange={(e) => handleInputChange(item.userId, "role", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 focus:border-sky-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700">
                      <FaCheckCircle className="text-sky-600" />
                      Verification Status
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="checkbox"
                        checked={item.staffVerified}
                        onChange={(e) => handleInputChange(item.userId, "staffVerified", e.target.checked)}
                        className="size-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-xs font-bold text-slate-700">
                        {item.staffVerified ? "Verified" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* NID UPLOADS */}
                <div className="pt-3 border-t border-slate-100">
                  <label className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-700">
                    <FaIdCard className="text-sky-600" />
                    NID Document Upload
                  </label>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* FRONT */}
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-center">
                      <p className="mb-2 text-xs font-semibold text-slate-600">NID Front</p>
                      {item.nidFront ? (
                        <div
                          onClick={() => setSelectedImage(item.nidFront)}
                          className="group relative mb-2 h-24 cursor-pointer overflow-hidden rounded-lg border border-slate-200"
                        >
                          <img src={item.nidFront} alt="NID Front" className="size-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                            <FaSearchPlus className="text-white text-lg" />
                          </div>
                        </div>
                      ) : (
                        <div className="mb-2 flex h-24 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs text-slate-400">
                          No image
                        </div>
                      )}
                      <label
                        htmlFor={`nid-front-${item.userId}`}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-sky-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-800"
                      >
                        {uploadingState[`${item.userId}_nidFront`] ? <FaSpinner className="animate-spin" /> : <FaCamera />}
                        Upload Front
                      </label>
                      <input
                        id={`nid-front-${item.userId}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files?.[0], "nidFront", item.userId)}
                        disabled={uploadingState[`${item.userId}_nidFront`]}
                        className="hidden"
                      />
                    </div>

                    {/* BACK */}
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-center">
                      <p className="mb-2 text-xs font-semibold text-slate-600">NID Back</p>
                      {item.nidBack ? (
                        <div
                          onClick={() => setSelectedImage(item.nidBack)}
                          className="group relative mb-2 h-24 cursor-pointer overflow-hidden rounded-lg border border-slate-200"
                        >
                          <img src={item.nidBack} alt="NID Back" className="size-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                            <FaSearchPlus className="text-white text-lg" />
                          </div>
                        </div>
                      ) : (
                        <div className="mb-2 flex h-24 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs text-slate-400">
                          No image
                        </div>
                      )}
                      <label
                        htmlFor={`nid-back-${item.userId}`}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-sky-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-800"
                      >
                        {uploadingState[`${item.userId}_nidBack`] ? <FaSpinner className="animate-spin" /> : <FaCamera />}
                        Upload Back
                      </label>
                      <input
                        id={`nid-back-${item.userId}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files?.[0], "nidBack", item.userId)}
                        disabled={uploadingState[`${item.userId}_nidBack`]}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              {isAdminOrManager ? (
                <button
                  type="button"
                  onClick={() => handleDeleteProfile(item.userId)}
                  disabled={deletingId === item.userId}
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-rose-700 disabled:opacity-50"
                >
                  {deletingId === item.userId ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />}
                  {deletingId === item.userId ? "Deleting..." : "Delete Profile"}
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => handleSaveInfo(item)}
                disabled={savingId === item.userId}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-50"
              >
                {savingId === item.userId ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {savingId === item.userId ? "Saving..." : "Save Info"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================
          ADD NEW PROFILE MODAL (ADMIN / MANAGER ONLY)
      ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FaUserPlus className="text-sky-600" /> Add New User Profile
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">User ID / Unique String *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 64abc123... or custom id"
                  value={newProfile.userId}
                  onChange={(e) => setNewProfile((prev) => ({ ...prev, userId: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-sky-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={newProfile.name}
                  onChange={(e) => setNewProfile((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-sky-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Mobile Number *</label>
                <input
                  type="text"
                  required
                  placeholder="Mobile number"
                  value={newProfile.mobile}
                  onChange={(e) => setNewProfile((prev) => ({ ...prev, mobile: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-sky-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Role</label>
                  <input
                    type="text"
                    value={newProfile.role}
                    onChange={(e) => setNewProfile((prev) => ({ ...prev, role: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-sky-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Address</label>
                  <input
                    type="text"
                    placeholder="Address"
                    value={newProfile.address}
                    onChange={(e) => setNewProfile((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-sky-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={newProfile.staffVerified}
                  onChange={(e) => setNewProfile((prev) => ({ ...prev, staffVerified: e.target.checked }))}
                  className="size-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-xs font-bold text-slate-700">Staff Verified</span>
              </div>

              {/* IMAGE UPLOADS IN MODAL */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-600 mb-1">Avatar</p>
                  {newProfile.image ? (
                    <img src={newProfile.image} alt="Avatar" className="mx-auto h-12 w-12 rounded-full object-cover mb-1" />
                  ) : null}
                  <label className="inline-block cursor-pointer rounded bg-sky-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-sky-700">
                    {uploadingState["new_image"] ? "Uploading..." : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], "image", "new")}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-600 mb-1">NID Front</p>
                  {newProfile.nidFront ? (
                    <img src={newProfile.nidFront} alt="Front" className="mx-auto h-12 w-16 rounded object-cover mb-1" />
                  ) : null}
                  <label className="inline-block cursor-pointer rounded bg-sky-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-sky-700">
                    {uploadingState["new_nidFront"] ? "Uploading..." : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], "nidFront", "new")}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-600 mb-1">NID Back</p>
                  {newProfile.nidBack ? (
                    <img src={newProfile.nidBack} alt="Back" className="mx-auto h-12 w-16 rounded object-cover mb-1" />
                  ) : null}
                  <label className="inline-block cursor-pointer rounded bg-sky-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-sky-700">
                    {uploadingState["new_nidBack"] ? "Uploading..." : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], "nidBack", "new")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {creating ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  {creating ? "Creating..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN PREVIEW MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center overflow-hidden rounded-xl bg-black/40 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-lg hover:bg-slate-900"
            >
              <FaTimes className="text-lg" />
            </button>
            <img src={selectedImage} alt="Preview" className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}