export interface CarData {
  brand: string;
  model: string;
  production_years: string;
  from_year: number;
  to_year: number;
  body_style: string;
  segment: string;
  title: string;
  description: string;
  engine_specs_title: string;
  cylinders: string;
  displacement: string;
  power: string;
  torque: string;
  fuel_system: string;
  fuel: string;
  fuel_capacity: string;
  top_speed: string;
  drive_type: string;
  gearbox: string;
  front: string; // Brakes
  rear: string; // Brakes
  tire_size: string;
  length: string;
  width: string;
  height: string;
  front_rear_track: string;
  wheelbase: string;
  cargo_volume: string;
  unladen_weight: string;
  highway: string; // Fuel economy
  combined: string; // Fuel economy
  acceleration: string;
  aerodynamics: string;
  city: string; // Fuel economy
  ground_clearance: string;
  gross_weight_limit: string;
  brand_url: string;
  brand_logo_url: string;
  model_url: string;
  image_urls: string; // Comma separated URLs
  image_file_names: string; // Array string "['file1.jpg', 'file2.jpg']"
  dir_path: string;
  total_images: number;
}
