import { NextApiRequest, NextApiResponse } from "next";

function tagList() {
	return fetch(
		"https://raw.githubusercontent.com/MotherOfClamperl/terriverse/main/list.txt"
	)
		.then((res) => res.text())
		.then((txt) => txt.split("\n"))
		.catch((error) => console.warn(error));
}
function tagCheck(tag: string) {
	//check if user tag is live (html contains SpanLiveBadge)
	return fetch("https://tiktok.com/@" + tag)
		.then((res) => res.text())
		.then((res) => res.split("SpanLiveBadge").length - 1 > 0);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	// res.status(200).json({ message: "Hello from the serverless function!" });
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
