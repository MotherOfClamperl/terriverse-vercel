import { NextApiRequest, NextApiResponse } from "next";
import { Browser, chromium } from "@playwright/test";

const TERRI_REFRESH_MINUTES = 3,
	SPINOFFS_REFRESH_MINUTES = 10;

//@ts-ignore
if (!global.terriTags) global.terriTags = { _itzpsyiconic_: false }; //@ts-ignore
if (!global.spinoffTags) global.spinoffTags = {}; //@ts-ignore
if (!global.browser)
	chromium.launch().then((browser: Browser) => {
		//@ts-ignore
		global.browser = browser;
		afterBrowserLaunched();
	});

function fetchTags(cb: (tagData: string) => void) {
	try {
		return fetch(
			"https://raw.githubusercontent.com/MotherOfClamperl/terriverse/main/list.txt",
		)
			.then((res) => res.text())
			.then((txt) => {
				cb(txt);
			})
			.catch((error) => console.warn(error));
	} catch (err) {
		console.warn("error fetching " + (err as Error).message);
	}
}
function afterBrowserLaunched() {
	//@ts-ignore
	if (!global.tagData)
		fetchTags((tagData) => {
			//@ts-ignore
			global.tagData = tagData; //@ts-ignore
			const terriAndSpinoffTags = tagData.split("\n\n");
			const terriTags = terriAndSpinoffTags[0].split("\n");
			const spinoffTags = terriAndSpinoffTags[1].split("\n");
			if (spinoffTags[spinoffTags.length - 1] === "") spinoffTags.pop();

			const startingTerriStates = new Array(terriTags.length).fill(false); //just assume everyone is offline until we can process the tag
			const startingSpinoffStates = new Array(spinoffTags.length).fill(
				false,
			); //just assume everyone is offline until we can process the tag
			//@ts-ignore
			global.terriTags = Object.fromEntries(
				terriTags.map((e, i) => [e, startingTerriStates[i]]),
			); //@ts-ignore
			global.spinoffTags = Object.fromEntries(
				spinoffTags.map((e, i) => [e, startingSpinoffStates[i]]),
			);
			startProcessingTags().then(() => {});
		});
	else startProcessingTags().then(() => {});
}

async function tagCheck(tag: string) {
	//@ts-ignore
	const page = await global.browser.newPage();
	try {
		await page.goto("https://tiktok.com/@" + tag);
	} catch (e) {
		return false;
	}
	const links = await page.getByRole("link").all();
	for (let link of links)
		if ((await link.getAttribute("target")) === "tiktok_live_view_window")
			return true;
	return false;
}
async function startProcessingTags() {
	function process(globalKey: string) {
		return async function () {
			//@ts-ignore
			for (const tag in global[globalKey]) {
				//@ts-ignore
				global[globalKey][tag] = await tagCheck(tag); //@ts-ignore
				console.log(`@${tag} = ${global[globalKey][tag]}`);
			}
		};
	}
	//@ts-ignore
	const processTeri = process("terriTags");
	//@ts-ignore
	const processSpinoffs = process("spinoffTags");
	setInterval(processTeri, TERRI_REFRESH_MINUTES * 1000 * 60);
	setInterval(processSpinoffs, SPINOFFS_REFRESH_MINUTES * 1000 * 60);
	processTeri();
	processSpinoffs();
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	res.status(200).json({
		//@ts-ignore
		tagInfo: global.terriTags,
	});
}
