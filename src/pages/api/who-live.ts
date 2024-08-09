import { NextApiRequest, NextApiResponse } from "next";
import {Browser, firefox} from "@playwright/test";

function tagList() {
	try {
		return fetch(
			"https://raw.githubusercontent.com/MotherOfClamperl/terriverse/main/list.txt"
		)
			.then((res) => res.text())
			.then((txt) => txt.split("\n\n")[0].split("\n"))
			.catch((error) => console.warn(error));
	} catch (err) {
		console.error("Error fetching tags:", err);
		return new Promise((resolve, reject) => {
			resolve(["_itzpsyiconic_"]); // at least return main tag
		}) as Promise<string[]>;
	}
}


export default function handler(req: NextApiRequest, res: NextApiResponse) {
	tagList().then((tags: string[] | void) => {
		if (!tags) return res.status(200).json({ err: "no tag list" });
		async function tagCheck(tag: string) {
			const page = await browser.newPage();
			try {
				await page.goto("https://tiktok.com/@" + tag);
			} catch(e) {
				return false;
			}
			const links = await page.getByRole("link").all();
			console.log(`lennn ${links.length}`);
			for (let link of links)
				if ((await link.getAttribute("target")) === "tiktok_live_view_window")
					return true;
			return false;
		}
		// tags.push("XXX"); // test: uncomment line, replace XXX with tag of currently live user (it will be the sole "true" response)
		let browser: Browser;
		firefox.launch().then((_browser: Browser) => {
			browser = _browser;
			const tagInfo: { [key: string]: boolean } = {};
			let tagCount = tags.length;
			for (let i in tags) {
				const tag = tags[i];
				if (!tag) {
					tagCount--;
					continue;
				} //ignore blank lines
				tagCheck(tag)
					.then((res) => {
						tagInfo[tag] = res;
						console.log(`${Object.keys(tagInfo).length}===${tagCount}`);
						if (Object.keys(tagInfo).length === tagCount) console.log(tagInfo);
						if (Object.keys(tagInfo).length === tagCount) finishResponse().then((res) => {});
					})
			}
			async function finishResponse() {
				res.status(200).json({
					tagInfo,
				});
				await browser.close();
			}
		});
	});
}
