import { MongoClient } from 'mongodb';
import { MOCK_CARS } from '../lib/mockdata';
import * as dotenv from 'dotenv';

// Load env vars
dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Please set MONGODB_URI in .env');
  process.exit(1);
}

async function main() {
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri!);

  try {
    await client.connect();
    console.log('Connected.');

    const db = client.db('cardashboard'); // Explicit DB name or from URI path if preferred
    const collection = db.collection('cars');

    // Optional: Clear existing data
    console.log('Clearing old data...');
    await collection.deleteMany({});

    console.log(`Seeding ${MOCK_CARS.length} cars...`);
    // Insert in batches to be safe, though 3800 is small enough for one go usually.
    // MongoDB insertMany has a limit, typically 100,000 writes in a batch is fine.

    if (MOCK_CARS.length > 0) {
        await collection.insertMany(MOCK_CARS);
    }

    // Create indexes for search
    console.log('Creating indexes...');
    await collection.createIndex({ brand: 1 });
    await collection.createIndex({ model: 1 });
    // Text index for search
    await collection.createIndex({ brand: "text", model: "text", body_style: "text" });

    console.log('Done!');
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
