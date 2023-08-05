import LiveWidget from "./LiveWidget";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center p-24">
			<h2 className="text-3xl font-extrabold">The Terriverse</h2>
			<LiveWidget />
		</main>
	);
}
