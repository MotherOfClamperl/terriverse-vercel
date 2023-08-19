import { NextApiRequest, NextApiResponse } from "next";

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

const LiveTagRegex = new RegExp("SpanLiveBadge");
function tagCheck(tag: string) {
	try {
		return fetch("https://tiktok.com/@" + tag)
			.then((res) => res.text())
			.then((res) => LiveTagRegex.test(res));
	} catch (err) {
		console.error("Error fetch checking tag: " + tag, err);
		return new Promise((resolve, reject) => {
			resolve(false); // don't retry, just pass false
		}) as Promise<boolean>;
	}
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	tagList().then((tags: string[] | void) => {
		if (!tags) return res.status(200).json({ err: "no tag list" });
		// tags.push("XXX"); // test: uncomment line, replace XXX with tag of currently live user (it will be the sole "true" response)
		function finishResponse() {
			res.status(200).json({
				tagInfo,
			});
		}
		const tagInfo: { [key: string]: boolean } = {};
		let tagCount = tags.length;
		for (let i in tags) {
			const tag = tags[i];
			if (!tag) {
				tagCount--;
				continue;
			} //ignore blank lines
			tagCheck(tag).then((res) => {
				tagInfo[tag] = res;
				if (Object.keys(tagInfo).length === tagCount) finishResponse();
			});
		}
	});
}
