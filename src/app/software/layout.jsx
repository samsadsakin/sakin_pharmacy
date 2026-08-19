import Sidebar from "@/components/software/Navbar/Navbar";

import SoftwareGuard from "@/components/software/SoftwareGuard";


// =====================================
// SOFTWARE METADATA
// =====================================

export const metadata = {

  title:
    "Sakin Pharmacy Software",

  description:
    "Sakin Pharmacy Software",

  icons: {
    icon: "/images/Logo2.jpg",
  },



};


export default function SoftwareLayout({
  children,
}) {

  return (

    <SoftwareGuard>

      <Sidebar>

        {children}

      </Sidebar>

    </SoftwareGuard>

  );
}