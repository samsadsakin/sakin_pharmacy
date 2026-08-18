import MedicineNav from "@/components/software/medicine/(more)/medicineNav";

export default function MedicineLayout({
  children,
}) {
  return (
    <>
      {/* Common Medicine Navigation */}
      <MedicineNav />

      {/* Changeable Page */}
      {children}
    </>
  );
}