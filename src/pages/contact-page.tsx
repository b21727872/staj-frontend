import { useState, type FormEvent } from "react"
import { ApiError, sendContact } from "@/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ sent: boolean; detail: string } | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim().replace(/\s+/g, " ")
    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()
    if (trimmedName.length < 2) {
      setError("Ad soyad gerekli.")
      setNotice(null)
      return
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Geçerli bir e-posta adresi girin.")
      setNotice(null)
      return
    }
    if (!trimmedMessage) {
      setError("Mesaj gerekli.")
      setNotice(null)
      return
    }

    setSubmitting(true)
    setError(null)
    setNotice(null)
    try {
      const result = await sendContact(trimmedName, trimmedEmail, trimmedMessage)
      setNotice(result)
      if (result.sent) {
        setName("")
        setEmail("")
        setMessage("")
      }
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "Mesaj gönderilemedi.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
          İletişim
        </p>
        <h1 className="font-heading text-4xl tracking-tight text-foreground sm:text-5xl">İletişim</h1>
        <p className="max-w-xl text-muted-foreground">
          Ad soyad, e-posta ve mesajınız e-posta olarak gider. Giriş gerekmez.
        </p>
      </header>
      <Card>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="contact-name">Ad soyad</Label>
              <Input
                id="contact-name"
                name="name"
                autoComplete="name"
                value={name}
                maxLength={80}
                onChange={(event) => {
                  setName(event.target.value)
                  setError(null)
                  setNotice(null)
                }}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Mesaj</Label>
              <Textarea
                id="contact-message"
                name="message"
                value={message}
                maxLength={4000}
                onChange={(event) => {
                  setMessage(event.target.value)
                  setError(null)
                  setNotice(null)
                }}
                className="min-h-36 text-base leading-relaxed md:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">E-posta</Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                maxLength={254}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setError(null)
                  setNotice(null)
                }}
                className="h-10"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            {notice && (
              <p role="status" className={notice.sent ? "text-sm text-primary" : "text-sm text-foreground"}>
                {notice.detail}
              </p>
            )}
            <Button type="submit" className="h-10 px-4" disabled={submitting}>
              {submitting ? "Gönderiliyor…" : "Gönder"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </article>
  )
}
