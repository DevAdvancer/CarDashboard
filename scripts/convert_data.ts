import { getCarData } from '../lib/csv-parser';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('Reading CSV data...');
  try {
    const cars = await getCarData();
    console.log(`Parsed ${cars.length} cars.`);

    // Chunk the data to avoid TS2590 "Union type too complex"
    const CHUNK_SIZE = 500;
    const chunks = [];
    for (let i = 0; i < cars.length; i += CHUNK_SIZE) {
      chunks.push(cars.slice(i, i + CHUNK_SIZE));
    }

    let fileContent = `import { CarData } from './types';\n\n`;

    // Write chunks
    chunks.forEach((chunk, index) => {
      fileContent += `const chunk${index} = ${JSON.stringify(chunk)} as any;\n`;
    });

    // Combine chunks
    fileContent += `\nexport const MOCK_CARS: CarData[] = [\n`;
    chunks.forEach((_, index) => {
      fileContent += `  ...chunk${index},\n`;
    });
    fileContent += `];\n`;

    const outputPath = path.join(process.cwd(), 'lib/mockdata.ts');
    fs.writeFileSync(outputPath, fileContent);
    console.log(`Successfully wrote to ${outputPath}`);
  } catch (error) {
    console.error('Error converting data:', error);
    process.exit(1);
  }
}

main();
