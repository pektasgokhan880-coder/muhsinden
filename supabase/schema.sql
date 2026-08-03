-- AS AUTO — Supabase şema
-- Supabase SQL Editor'da çalıştırın

-- Araçlar tablosu
CREATE TABLE IF NOT EXISTS cars (
  id BIGSERIAL PRIMARY KEY,
  marka TEXT NOT NULL,
  model TEXT NOT NULL,
  yil INTEGER,
  km INTEGER DEFAULT 0,
  yakit TEXT,
  vites TEXT,
  fiyat BIGINT NOT NULL DEFAULT 0,
  durum TEXT DEFAULT 'Aktif',
  aciklama TEXT,
  resim TEXT,
  tramer TEXT DEFAULT 'Hasar kaydı yoktur',
  donanim JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Var olan veritabanlarına sütun ekleme (opsiyonel güvenli ekleme)
ALTER TABLE cars ADD COLUMN IF NOT EXISTS tramer TEXT DEFAULT 'Hasar kaydı yoktur';
ALTER TABLE cars ADD COLUMN IF NOT EXISTS donanim JSONB DEFAULT '[]'::jsonb;

-- Galeri fotoğrafları
CREATE TABLE IF NOT EXISTS car_images (
  id BIGSERIAL PRIMARY KEY,
  car_id BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_car_images_car_id ON car_images(car_id);
CREATE INDEX IF NOT EXISTS idx_cars_durum ON cars(durum);

-- Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (public site)
CREATE POLICY "cars_public_read" ON cars FOR SELECT USING (true);
CREATE POLICY "car_images_public_read" ON car_images FOR SELECT USING (true);

-- Anon insert/update/delete (Admin panel için)
CREATE POLICY "cars_anon_write" ON cars FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "car_images_anon_write" ON car_images FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket: Dashboard > Storage > New bucket > "car-images" (public)
