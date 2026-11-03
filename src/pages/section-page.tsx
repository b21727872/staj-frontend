import { useState, type FormEvent } from "react"
import { useParams } from "react-router-dom"
import { ApiError } from "@/api"
import { useAuth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { NAV_ITEMS } from "@/nav"
import { useSections } from "@/sections"

const CONTENT_LIMIT = 20_000

export function SectionPage({ slug: forcedSlug }: { slug?: string }) {
  const params = useParams()
  const slug = forcedSlug ?? params.slug ?? ""
  const known = NAV_ITEMS.find((item) => item.slug === slug)
  const { sections, status, error, reload } = useSections()
  const section = sections.find((item) => item.slug === slug)
  const title = section?.title ?? known?.title ?? "Sayfa"

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Bölüm
        </p>
        <h1 className="font-heading text-4xl tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
      </header>

      {status === "loading" && (
        <Card>
          <CardContent>
            <p className="text-muted-foreground">İçerik yükleniyor…</p>
          </CardContent>
        </Card>
      )}

      {status === "error" && (
        <Card>
          <CardContent className="space-y-4">
            <p className="text-destructive">{error ?? "İçerik alınamadı."}</p>
            <Button type="button" variant="outline" onClick={reload}>
              Yeniden dene
            </Button>
          </CardContent>
        </Card>
      )}

      {status === "ready" && !known && (
        <Card>
          <CardContent>
            <p>Bu adres bir bölüm sayfasına ait değil.</p>
          </CardContent>
        </Card>
      )}

      {status === "ready" && known && !section && (
        <Card>
          <CardContent>
            <p>Bu bölüm sunucuda bulunamadı.</p>
          </CardContent>
        </Card>
      )}

      {status === "ready" && section && <ContentArea key={section.slug} slug={section.slug} content={section.content} />}
    </article>
  )
}

function ContentArea({ slug, content }: { slug: string; content: string }) {
  const { isAuthenticated, logout } = useAuth()
  const { saveSection } = useSections()
  const [draft, setDraft] = useState(content)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageTone, setMessageTone] = useState<"ok" | "error">("ok")

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (draft.length > CONTENT_LIMIT) {
      setMessageTone("error")
      setMessage("İçerik 20.000 karakteri aşamaz.")
      return
    }
    setSaving(true)
    setMessage(null)
    try {
      const saved = await saveSection(slug, draft)
      setDraft(saved.content)
      setMessageTone("ok")
      setMessage("İçerik kaydedildi.")
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 401) {
        logout()
      }
      setMessageTone("error")
      setMessage(reason instanceof Error ? reason.message : "İçerik kaydedilemedi.")
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent>
          {content.trim() ? (
            <p className="text-lg leading-relaxed whitespace-pre-wrap text-foreground">{content}</p>
          ) : (
            <p className="text-muted-foreground">Bu bölüm için henüz içerik girilmedi.</p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="section-content">İçerik</Label>
            <Textarea
              id="section-content"
              value={draft}
              maxLength={CONTENT_LIMIT}
              onChange={(event) => {
                setDraft(event.target.value)
                setMessage(null)
              }}
              className="min-h-64 text-base leading-relaxed md:text-base"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {draft.length.toLocaleString("tr-TR")} / {CONTENT_LIMIT.toLocaleString("tr-TR")} karakter
            </p>
            <Button type="submit" className="h-10 px-4" disabled={saving}>
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </Button>
          </div>
          {message && (
            <p
              role="status"
              className={messageTone === "ok" ? "text-sm text-primary" : "text-sm text-destructive"}
            >
              {message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
