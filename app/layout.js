import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>HEADER</header>
        {children}
      </body>
    </html>
  );
}
