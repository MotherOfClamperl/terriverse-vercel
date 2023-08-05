import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "The Terriverse",
	description: "terri and friends, are they or aren't they!? live????",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
