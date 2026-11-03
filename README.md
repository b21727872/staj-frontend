# Proje Portalı

React arayüzü. Menüden Anasayfa, Proje Hakkında, Proje Ekibi, Proje Çıktıları ve İletişim açılır. İletişim formu giriş istemez.

## Çalıştırma

API’nin `http://127.0.0.1:8742` adresinde çalışması gerekir.

```bash
npm install
npm run dev
```

Tarayıcıda [http://127.0.0.1:43127](http://127.0.0.1:43127) adresini açın. `/api` istekleri API sunucusuna gider.

Deneme hesabı: `admin` / `proje2026`

## Production

API adresini build sırasında verin. Değer backend’in kök adresidir; sonuna `/` veya `/api` eklemeyin.

```bash
VITE_API_URL=https://staj-backend.up.railway.app npm run build
```

Boş bırakılırsa istekler aynı sitedeki `/api` yoluna gider. Backend’de `CORS_ORIGINS` bu arayüzün adresini içermelidir.
