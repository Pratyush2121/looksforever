import fs from 'fs';

const html = fs.readFileSync('page.html', 'utf8');

const target = 'fine-superior-250x250.png';
const idx = html.indexOf(target);
if (idx !== -1) {
  console.log('--- Context of fine-superior-250x250.png ---');
  console.log(html.substring(idx - 400, idx + 1200));
} else {
  console.log('Not found');
}
