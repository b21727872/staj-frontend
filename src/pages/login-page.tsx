import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ApiError } from "@/api"
import { useAuth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginPage() {
  const { isAuthenticated, login, logout } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!username.trim() || !password) {
      setError("Kullanıcı adı ve şifre gerekli.")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await login(username.trim(), password)
      navigate("/", { replace: true })
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "Giriş yapılamadı.")
    } finally {
      setSubmitting(false)
    }
  }

  if (isAuthenticated) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Oturum açık</CardTitle>
          <CardDescription>
            Bölüm sayfalarındaki içerik alanından metni değiştirip kaydedebilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-10 px-4">
            <Link to="/">Anasayfaya dön</Link>
          </Button>
          <Button type="button" variant="outline" className="h-10 px-4" onClick={logout}>
            Çıkış yap
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-heading text-3xl">Yönetim girişi</CardTitle>
        <CardDescription>
          Girişten sonra her bölümün tek içerik alanını düzenleyebilirsiniz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="username">Kullanıcı adı</Label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" className="h-10 w-full px-4" disabled={submitting}>
            {submitting ? "Giriş yapılıyor…" : "Giriş yap"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
