import Sidebar from "@/components/software/Navbar/Navbar";


// =====================================
// SOFTWARE METADATA
// =====================================

export const metadata = {

  title:
    "Sakin Pharmacy Software",

  description:
    "Sakin Pharmacy Software",

  icons: {
    icon: "/images/logo2.jpg",
  },

};


export default function SoftwareLayout({
  children,
}) {

  return (

    <Sidebar>

      {children}

    </Sidebar>

  );

}