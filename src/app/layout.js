import { GlobalProviders } from "@/providers/GlobalProviders";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import "./globals.css";

export const metadata = {
  title: "StyleHub | Premium Fashion & Clothing Store",
  description:
    "Discover the latest fashion trends at StyleHub. Shop premium clothing, shoes, accessories, and more with fast delivery and secure online shopping.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GlobalProviders>
          {children}
          <ToastContainer position="top-right" autoClose={2000} />
        </GlobalProviders>
      </body>
    </html>
  );
}

