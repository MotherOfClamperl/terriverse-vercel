"use client"; // This is a client component 👈🏽
import React, { useEffect, useState } from "react";
import Image from "next/image";

type responseType = { [key: string]: boolean };

function alphabetizeObjectByKeys(unordered: responseType) {
	return Object.keys(unordered)
		.sort()
		.reduce((obj: responseType, key) => {
			obj[key] = unordered[key];
			return obj;
		}, {});
}

function renderApiResponse(apiResponse: responseType) {
	return (
		<ul>
			{Object.keys(apiResponse).map((tag, i) => {
				return (
					<li
						className={`${
							apiResponse[tag]
								? "marker:text-green-900"
								: "marker:text-red-900"
						} text-3xl list-disc ml-6 leading-5 hover:underline`}
						key={i}
					>
						<a
							href={
								"https://tiktok.com/@" +
								tag +
								(apiResponse[tag] ? "/live" : "")
							}
							target="_BLANK"
							className="text-base"
						>
							@{tag}
						</a>
					</li>
				);
			})}
		</ul>
	);
}

export default function LiveWidget() {
	const [terriState, setTerriState] = useState(null as boolean | null);
	const [apiResponse, setApiResponse] = useState(null as responseType | null);
	const [apiResponse2, setApiResponse2] = useState(
		null as responseType | null
	);
	async function whoLive() {
		setTerriState(null);
		setApiResponse(null);
		try {
			const response = await fetch("/api/who-live");
			const data = await response.json();
			setApiResponse(alphabetizeObjectByKeys(data.tagInfo));
			//process data
			let isTerriLive = false;
			for (let i in data.tagInfo) if (data.tagInfo[i]) isTerriLive = true;
			setTerriState(isTerriLive);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}
	async function whoLive2() {
		setApiResponse2(null);
		try {
			const response = await fetch("/api/who-live/spinoffs");
			const data = await response.json();
			setApiResponse2(alphabetizeObjectByKeys(data.tagInfo));
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}
	useEffect(() => {
		whoLive();
	}, []);

	return (
		<div>
			<div>
				&nbsp;
				<div>
					{terriState !== null && (
						<Image
							src={
								terriState
									? "https://media.discordapp.net/stickers/1049246228627603456.webp?size=60"
									: "https://media.discordapp.net/stickers/1049244297045758082.webp?size=60"
							}
							width={60}
							height={60}
							alt={terriState ? "Live" : "Offline"}
							className="inline-block mb-2"
						/>
					)}
					&nbsp;
					{terriState !== null && (
						<span
							className={`${
								terriState ? "text-green-900" : "text-red-900"
							} font-extrabold`}
						>
							{terriState ? "Live" : "Offline"}
						</span>
					)}
				</div>
				<button
					className="mb-1 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
					onClick={whoLive}
				>
					is terri live? 🔄
				</button>
				{apiResponse && renderApiResponse(apiResponse)}
			</div>
			<div>
				<button
					className="mt-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
					onClick={whoLive2}
				>
					side characters
				</button>
				{apiResponse2 && renderApiResponse(apiResponse2)}
			</div>
			&nbsp;
			<br />
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
