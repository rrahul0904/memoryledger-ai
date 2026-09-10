import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"MemoryLedger AI",description:"AI that remembers your work, not just your chats."};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
