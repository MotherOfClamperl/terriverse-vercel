import Image from "next/image";
import LiveWidget from "./LiveWidget";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center p-24">
			the terriverse
			<LiveWidget />
		</main>
	);
}
