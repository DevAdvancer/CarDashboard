import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import { CarData } from './types';

export async function getCarData(): Promise<CarData[]> {
  const filePath = path.join(process.cwd(), 'data_full.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  return new Promise((resolve, reject) => {
    Papa.parse<CarData>(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Automatically parse numbers
      complete: (results) => {
        resolve(results.data);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
}
