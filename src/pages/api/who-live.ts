import { NextApiRequest, NextApiResponse } from "next";
import {Browser, firefox} from "@playwright/test";

//@ts-ignore
if (!global.terriTags) global.terriTags = {"_itzpsyiconic_": false}; //@ts-ignore
if (!global.spinoffTags) global.spinoffTags = {}; //@ts-ignore
if (!global.browser) firefox.launch().then((browser: Browser) => {
	//@ts-ignore
	global.browser = browser;
	afterBrowserLaunched();
});

function fetchTags(cb: (tagData: string) => void) {
	try {
		return fetch(
			"https://raw.githubusercontent.com/MotherOfClamperl/terriverse/main/list.txt"
		)
			.then((res) => res.text())
			.then((txt) => {
				cb(txt)
			})
			.catch((error) => console.warn(error));
	} catch (err) {
		console.warn('error fetching ' + (err as Error).message);
	}
}
function afterBrowserLaunched() {
	//@ts-ignore
	if (!global.tagData) fetchTags((tagData) => {
		//@ts-ignore
		global.tagData = tagData;//@ts-ignore
		const terriAndSpinoffTags = tagData.split("\n\n");
		const terriTags = terriAndSpinoffTags[0].split("\n");
		const spinoffTags = terriAndSpinoffTags[1].split("\n");
		if (spinoffTags[spinoffTags.length - 1] === "") spinoffTags.pop()
		const startingTerriStates = new Array(terriTags.length).fill(false); //just assume everyone is offline until we can process the tag
		const startingSpinoffStates = new Array(spinoffTags.length).fill(false); //just assume everyone is offline until we can process the tag
		//@ts-ignore
		global.terriTags = Object.fromEntries(terriTags.map((e, i) => [e, startingTerriStates[i]])); //@ts-ignore
		global.spinoffTags = Object.fromEntries(spinoffTags.map((e, i) => [e, startingSpinoffStates[i]]));
		startProcessingTags();
	});
	else startProcessingTags();
}

function startProcessingTags() {
	console.log(`lets process some tags`);
}


export default function handler(req: NextApiRequest, res: NextApiResponse) {
	res.status(200).json({ //@ts-ignore
		"tagInfo": global.terriTags,
	});
	// tagList().then((tags: string[] | void) => {
	// 	if (!tags) return res.status(200).json({ err: "no tag list" });
	// 	async function tagCheck(tag: string) {
	// 		const page = await browser.newPage();
	// 		try {
	// 			await page.goto("https://tiktok.com/@" + tag);
	// 		} catch(e) {
	// 			return false;
	// 		}
	// 		const links = await page.getByRole("link").all();
	// 		console.log(`lennn ${links.length}`);
	// 		for (let link of links)
	// 			if ((await link.getAttribute("target")) === "tiktok_live_view_window")
	// 				return true;
	// 		return false;
	// 	}
	// 	// tags.push("XXX"); // test: uncomment line, replace XXX with tag of currently live user (it will be the sole "true" response)
	// 	let browser: Browser;
	// 	firefox.launch().then((_browser: Browser) => {
	// 		browser = _browser;
	// 		const tagInfo: { [key: string]: boolean } = {};
	// 		let tagCount = tags.length;
	// 		for (let i in tags) {
	// 			const tag = tags[i];
	// 			if (!tag) {
	// 				tagCount--;
	// 				continue;
	// 			} //ignore blank lines
	// 			tagCheck(tag)
	// 				.then((res) => {
	// 					tagInfo[tag] = res;
	// 					console.log(`${Object.keys(tagInfo).length}===${tagCount}`);
	// 					if (Object.keys(tagInfo).length === tagCount) console.log(tagInfo);
	// 					if (Object.keys(tagInfo).length === tagCount) finishResponse().then((res) => {});
	// 				})
	// 		}
	// 		async function finishResponse() {
	// 			res.status(200).json({
	// 				tagInfo,
	// 			});
	// 			await browser.close();
	// 		}
	// 	});
	// });
}
