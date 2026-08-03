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
  donanim?: string[];
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

export const DONANIM_LISTESI = [
  "Hayalet Gösterge",
  "Panorama Cam Tavan",
  "Sunroof",
  "Deri Koltuklar",
  "Koltuk Isıtma",
  "Koltuk Soğutma",
  "Direksiyon Isıtma",
  "360° Kamera",
  "Geri Görüş Kamerası",
  "Head-up Display",
  "Kablosuz Şarj",
  "Apple CarPlay & Android Auto",
  "Harman Kardon / Burmester / Bang&Olufsen Ses",
  "Adaptif Hız Sabitleyici (ACC)",
  "Kör Nokta Uyarı Sistemi",
  "Şerit Takip Asistanı",
  "Vakum Kapılar",
  "Elektrikli Bagaj",
  "Matrix / LED Far",
  "Keyless Go (Anahtarsız Giriş)",
] as const;
