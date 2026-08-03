-- AS AUTO — Supabase Şema & Performans İndeksleri
-- Supabase SQL Editor'da çalıştırabilirsiniz

-- 1. Araçlar Tablosu
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
  vitrin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Var olan veritabanları için güvenli sütun eklemeleri
ALTER TABLE cars ADD COLUMN IF NOT EXISTS tramer TEXT DEFAULT 'Hasar kaydı yoktur';
ALTER TABLE cars ADD COLUMN IF NOT EXISTS donanim JSONB DEFAULT '[]'::jsonb;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS vitrin BOOLEAN DEFAULT false;

-- 2. Galeri Fotoğrafları Tablosu
CREATE TABLE IF NOT EXISTS car_images (
  id BIGSERIAL PRIMARY KEY,
  car_id BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Site Genel Ayarları Tablosu (Tek Satır Konfigürasyon)
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT DEFAULT 'AS AUTO',
  tagline TEXT DEFAULT 'Premium Otomobil Galerisi',
  description TEXT DEFAULT 'AS AUTO güvencesiyle ikinci el premium araç alım ve satım hizmetleri.',
  phone TEXT DEFAULT '05461772537',
  phone_display TEXT DEFAULT '0546 177 25 37',
  whatsapp TEXT DEFAULT '905461772537',
  address_line1 TEXT DEFAULT 'Ferhatpaşa Mah.',
  address_line2 TEXT DEFAULT 'Yeditepe Cad. No:30',
  address_city TEXT DEFAULT 'Ataşehir / İstanbul',
  social_facebook TEXT DEFAULT 'https://www.facebook.com',
  social_instagram TEXT DEFAULT 'https://www.instagram.com',
  social_tiktok TEXT DEFAULT 'https://www.tiktok.com',
  working_hours_weekday TEXT DEFAULT '09:00 - 19:00',
  working_hours_weekend TEXT DEFAULT '10:00 - 18:00',
  logo_url TEXT DEFAULT '/logo.svg',
  banner_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Varsayılan site ayarlarını doldur (Eğer yoksa)
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 4. Performans ve Hız İndeksleri (Supabase Sorgu Hızlandırma)
CREATE INDEX IF NOT EXISTS idx_car_images_car_id ON car_images(car_id);
CREATE INDEX IF NOT EXISTS idx_cars_durum ON cars(durum);
CREATE INDEX IF NOT EXISTS idx_cars_durum_id ON cars(durum, id DESC);
CREATE INDEX IF NOT EXISTS idx_cars_vitrin ON cars(vitrin);
CREATE INDEX IF NOT EXISTS idx_cars_marka ON cars(marka);

-- 5. Row Level Security (RLS)
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (Public site)
DROP POLICY IF EXISTS "cars_public_read" ON cars;
CREATE POLICY "cars_public_read" ON cars FOR SELECT USING (true);

DROP POLICY IF EXISTS "car_images_public_read" ON car_images;
CREATE POLICY "car_images_public_read" ON car_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "site_settings_public_read" ON site_settings;
CREATE POLICY "site_settings_public_read" ON site_settings FOR SELECT USING (true);

-- Yazma izinleri (Admin işlemler için)
DROP POLICY IF EXISTS "cars_anon_write" ON cars;
CREATE POLICY "cars_anon_write" ON cars FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "car_images_anon_write" ON car_images;
CREATE POLICY "car_images_anon_write" ON car_images FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "site_settings_anon_write" ON site_settings;
CREATE POLICY "site_settings_anon_write" ON site_settings FOR ALL USING (true) WITH CHECK (true);
