"use client"
import { useState } from "react"

export default function ImageUploader() {
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("image", file)

    setLoading(true)
    const res = await fetch("/api/image", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()
    setResponse(data.result)
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <input type="file" accept="image/*" onChange={handleUpload} />
      {loading && <p>Analisando imagem...</p>}
      {response && <p className="text-white">{response}</p>}
    </div>
  )
}
