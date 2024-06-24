import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Print on Demand",
	description: "Your Image on a Custom Phone Case",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<NavBar />
				<main className="flex flex-col min-h-[calc(100vh-3.5rem-1px)]">
					<div className="flex-1 flex flex-col h-full">
						{children}
					</div>
					<Footer />
				</main>
			</body>
		</html>
	);
}
