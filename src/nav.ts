export const NAV_ITEMS = [
  { slug: "anasayfa", title: "Anasayfa" },
  { slug: "proje-hakkinda", title: "Proje Hakkında" },
  { slug: "proje-ekibi", title: "Proje Ekibi" },
  { slug: "proje-ciktilari", title: "Proje Çıktıları" },
] as const

export const CONTACT_PATH = "/iletisim"

export function sectionPath(slug: string) {
  return slug === "anasayfa" ? "/" : `/${slug}`
}
