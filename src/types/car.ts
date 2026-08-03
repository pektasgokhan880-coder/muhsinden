export type CarStatus = "Aktif" | "Satıldı" | "Pasif";
export type FuelType = "Benzin" | "Dizel" | "Benzin / LPG" | "LPG" | "Elektrik" | "Hibrit";
export type TransmissionType = "Otomatik" | "Manuel" | "Yarı Otomatik";

export interface Car {
  id: number;
  marka: string;
  model: string;
  yil: number;
  km: number;
  yakit: FuelType | string;
  vites: TransmissionType | string;
  fiyat: number;
  durum: CarStatus | string;
  aciklama?: string;
  resim?: string;
  tramer?: string;
  donanim?: string[] | unknown;
  vitrin?: boolean;
  created_at?: string;
}

export interface CarImage {
  id: number;
  car_id: number;
  image_url: string;
  sort_order: number;
  created_at?: string;
}

export interface CarFilterState {
  search: string;
  marka: string;
  minFiyat: string;
  maxFiyat: string;
  minYil: string;
  maxYil: string;
  yakit: string;
  vites: string;
  sirala: string;
  durum: string;
}

/** Türkiye ve Dünya pazarında en popüler otomobil markaları */
export const ARAC_MARKALARI = [
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Bugatti",
  "BYD",
  "Cadillac",
  "Chery",
  "Chevrolet",
  "Citroën",
  "Cupra",
  "Dacia",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Ford",
  "Geely",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Isuzu",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lada",
  "Lamborghini",
  "Lancia",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "MG",
  "MINI",
  "Mitsubishi",
  "Nissan",
  "Opel",
  "Peugeot",
  "Porsche",
  "Renault",
  "Rolls-Royce",
  "SEAT",
  "Skoda",
  "Smart",
  "Subaru",
  "Suzuki",
  "Tesla",
  "TOGG",
  "Toyota",
  "Volkswagen",
  "Volvo",
] as const;
