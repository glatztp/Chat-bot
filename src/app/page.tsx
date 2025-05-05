import Chat from "@/components/Chat";
import "@n8n/chat"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-slate-50 items-center justify-center">
      <Chat />
    </div>
  )
}
