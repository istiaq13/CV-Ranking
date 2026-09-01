import "./globals.css";

export const metadata = {
  title: "Resume–JD Matcher & Career Coach",
  description: "NLP-powered platform for Resume-to-Job matching, skill gap diagnostics, tailored resume bullets, and mock interview prep.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
