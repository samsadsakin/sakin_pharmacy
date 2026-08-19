import DirectSaleNav from "@/components/software/directSale/DirectSaleNav";

export default function DirectSaleLayout({
  children,
}) {
  return (
    <>
      <DirectSaleNav />

      {children}
    </>
  );
}