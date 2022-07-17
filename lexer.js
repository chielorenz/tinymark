import { readFile } from 'fs/promises';

try {
	const data = await readFile('input.md', { encoding: 'utf8' });
	console.log(data);
} catch (err) {
	console.log(err);
}