import { NextApiRequest, NextApiResponse } from "next";

function tagList() {
	return fetch(
		"https://raw.githubusercontent.com/MotherOfClamperl/terriverse/main/list.txt"
	)
		.then((res) => res.text())
		.then((txt) => txt.split("\n\n")[0].split("\n"))
		.catch((error) => console.warn(error));
}

const LiveTagRegex = new RegExp("SpanLiveBadge");
function tagCheck(tag: string) {
	return fetch("https://tiktok.com/@" + tag)
		.then((res) => res.text())
		.then((res) => LiveTagRegex.test(res));
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
