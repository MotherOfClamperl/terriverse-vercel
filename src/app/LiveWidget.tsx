"use client"; // This is a client component 👈🏽
import React, { useEffect, useState } from "react";

type responseType = { [key: string]: boolean };

function alphabetizeObjectByKeys(unordered: responseType) {
	return Object.keys(unordered)
		.sort()
		.reduce((obj: responseType, key) => {
			obj[key] = unordered[key];
			return obj;
		}, {});
}

export default function LiveWidget() {
	const [apiResponse, setApiResponse] = useState(null as responseType | null);
	const [apiResponse2, setApiResponse2] = useState(
		null as { coming: string } | null
	);
	async function whoLive() {
		setApiResponse(null);
		try {
			const response = await fetch("/api/who-live");
			const data = await response.json();
			setApiResponse(alphabetizeObjectByKeys(data.tagInfo));
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}
	function whoLive2() {
		setApiResponse2({ coming: "very soon!" });
	}
	useEffect(() => {
		whoLive();
	}, []);

	return (
		<div>
			<div>
				&nbsp;
				<button
					className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
					onClick={whoLive}
				>
					is terri live?
				</button>
				{apiResponse && (
					<pre>{JSON.stringify(apiResponse, null, 2)}</pre>
				)}
			</div>
			<div>
				<button
					className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
					onClick={whoLive2}
				>
					side bitches?
				</button>
				{apiResponse2 && (
					<pre>{JSON.stringify(apiResponse2, null, 2)}</pre>
				)}
			</div>
			missing user tag? raise an issue / pull request &nbsp;on
			<a
				href="https://github.com/MotherOfClamperl/terriverse/issues/"
				target="_BLANK"
				className="text-blue-500"
			>
				&nbsp; GitHub
			</a>
		</div>
	);
}
