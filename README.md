# Muhsinden — Premium Otomobil Galerisi

Next.js 16 (App Router) + Supabase + Tailwind CSS 4 ile geliştirilmiş modern oto galeri sitesi.

## Özellikler

- Premium karanlık tema, mobil uyumlu arayüz
- Araç listeleme, filtreleme, arama ve sıralama
- Detay sayfası, fotoğraf galerisi, WhatsApp entegrasyonu
- Admin paneli (araç ekle / düzenle / sil)
- SEO: sitemap, robots.txt, Open Graph, JSON-LD
- Vercel'e tek tık deploy

## Kurulum

```bash
cp .env.example .env.local
# Değerleri doldurun

npm install
npm run dev
```

http://localhost:3000

## Ortam Değişkenleri

`.env.local` veya Vercel Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

ADMIN_USERNAME=admin
ADMIN_PASSWORD=guclu-bir-sifre-secin
```

## Supabase Kurulumu

1. [supabase.com](https://supabase.com) → Yeni proje oluştur
2. SQL Editor → `supabase/schema.sql` dosyasını çalıştır
3. Storage → New bucket → `car-images` (public)
4. Project Settings → API → URL ve anon key'i `.env.local`'e ekle

## GitHub + Vercel Deploy

1. GitHub'da yeni repo oluştur
2. Projeyi push et:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AS AUTO galeri sitesi"
   git remote add origin https://github.com/KULLANICI/muhsinden.git
   git push -u origin main
   ```
3. [vercel.com](https://vercel.com) → New Project → GitHub reposunu bağla
4. Environment Variables ekle (yukarıdaki tüm değişkenler)
5. Deploy

Production URL'ini aldıktan sonra `NEXT_PUBLIC_SITE_URL` değerini güncelle.

## Admin Panel

| Sayfa | URL |
|-------|-----|
| Giriş | `/admin/login` |
| Panel | `/admin/panel` |
| Araç ekle | `/admin/panel/ekle` |
| Düzenle | `/admin/panel/duzenle/[id]` |

Varsayılan (env yoksa, sadece geliştirme): `admin` / `321421`  
**Production'da mutlaka env ile değiştirin.**

## Güvenlik

- Admin girişi sunucu tarafında (`/api/admin/login`)
- Oturum çerezi: HttpOnly, SameSite=Lax, production'da Secure
- `/admin/panel/*` middleware ile korunuyor
- Araç silinince Storage + DB temizleniyor

## Site Ayarları

Telefon, adres, sosyal medya linkleri: `src/lib/site-config.ts`

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
```
"# muhsinden" 
"# muhsinden" 
