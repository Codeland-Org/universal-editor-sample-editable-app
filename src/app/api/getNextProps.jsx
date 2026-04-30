import { DOMParser } from '@xmldom/xmldom';

export async function getNextProps(path) {
	let data = {};

	try {
		if (!process.env.NEXT_PUBLIC_URL) {
			throw new Error('NEXT_PUBLIC_URL is undefined');
		}
		const url = process.env.NEXT_PUBLIC_URL + (path || '');
		const pageRes = await fetch(url);
		const pageText = await pageRes.text();

		const parser = new DOMParser();
		const doc = parser.parseFromString(pageText, 'text/html');

		const nextPropsContent = doc.getElementById('__NEXT_DATA__')?.textContent;

		if (!nextPropsContent) {
			throw new Error('no textContent found for element with __NEXT_DATA__ id');
		}

		data = JSON.parse(nextPropsContent);
	} catch (e) {
		if (typeof e === 'string') {
			console.error('__NEXT_DATA__ parsing error: ', e);
		} else if (e instanceof Error) {
			console.error('__NEXT_DATA__ parsing error: ', e.message);
		}
	}
	return data;
}
