'use server';

import clientPromise from '@/lib/mongodb';
import { CarData } from '@/lib/types';

export async function getCars({
  page = 1,
  limit = 20,
  query = '',
}: {
  page?: number;
  limit?: number;
  query?: string;
}) {
  const client = await clientPromise;
  const db = client.db('cardashboard');
  const collection = db.collection<CarData>('cars');

  const skip = (page - 1) * limit;

  let filter = {};
  if (query) {
    const regex = new RegExp(query, 'i');
    filter = {
      $or: [
        { brand: regex },
        { model: regex },
        { body_style: regex },
      ],
    };
  }

  const [cars, totalCount] = await Promise.all([
    collection
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray(),
    collection.countDocuments(filter),
  ]);

  // Convert _id to string or remove it to avoid serialization issues with Next.js client components
  const serializedCars = cars.map((car) => ({
    ...car,
    _id: car._id?.toString(),
  }));

  return {
    cars: serializedCars,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}
