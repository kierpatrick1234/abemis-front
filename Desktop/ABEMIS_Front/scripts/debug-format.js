const fs = require('fs');
const lines = fs.readFileSync('components/district-list.txt', 'utf8').split('\n');

for (let i = 4; i < 35; i++) {
  const line = lines[i];
  const hasTab = line.startsWith('\t');
  const hasSpace = line.startsWith(' ');
  const match = line.match(/^(\d+[a-z]+|lone|\d+\s+LD)\s+(.+)$/);
  console.log(`Line ${i}: [${JSON.stringify(line)}]`);
  console.log(`  startsWith tab: ${hasTab}, startsWith space: ${hasSpace}`);
  console.log(`  match: ${match ? 'YES' : 'NO'}`);
  if (match) {
    console.log(`  district: ${match[1]}, lgu: ${match[2]}`);
  }
  console.log('');
}
