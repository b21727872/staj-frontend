import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { fetchSections, updateSection, type Section } from "@/api"

type LoadStatus = "loading" | "ready" | "error"

type SectionsContextValue = {
  sections: Section[]
  status: LoadStatus
  error: string | null
  reload: () => void
  saveSection: (slug: string, content: string) => Promise<Section>
}

const SectionsContext = createContext<SectionsContextValue | null>(null)

export function SectionsProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<Section[]>([])
  const [status, setStatus] = useState<LoadStatus>("loading")
  const [error, setError] = useState<string | null>(null)
  const [requestId, setRequestId] = useState(0)

  const reload = useCallback(() => {
    setStatus("loading")
    setError(null)
    setRequestId((current) => current + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    fetchSections()
      .then((data) => {
        if (cancelled) return
        setSections(data.sections)
        setStatus("ready")
      })
      .catch((reason: unknown) => {
        if (cancelled) return
        const message = reason instanceof Error ? reason.message : "İçerik alınamadı."
        setError(message)
        setStatus("error")
      })

    return () => {
      cancelled = true
    }
  }, [requestId])

  const saveSection = useCallback(async (slug: string, content: string) => {
    const saved = await updateSection(slug, content)
    setSections((current) =>
      current.map((section) => (section.slug === saved.slug ? saved : section)),
    )
    return saved
  }, [])

  const value = useMemo(
    () => ({ sections, status, error, reload, saveSection }),
    [sections, status, error, reload, saveSection],
  )

  return <SectionsContext.Provider value={value}>{children}</SectionsContext.Provider>
}

export function useSections() {
  const value = useContext(SectionsContext)
  if (!value) {
    throw new Error("useSections must be used within SectionsProvider")
  }
  return value
}
