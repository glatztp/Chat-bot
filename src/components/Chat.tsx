'use client'

import { useChat } from "ai/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: 'api/chat'
  })

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl rounded-2xl border border-border bg-background">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Chat Assistente</CardTitle>
        <CardDescription className="text-muted-foreground">Faça perguntas e obtenha respostas instantaneamente.</CardDescription>
      </CardHeader>

      <CardContent>
        <div
          ref={scrollRef}
          className="h-[400px] overflow-y-auto pr-4 scroll-smooth space-y-4"
        >
          <AnimatePresence initial={false}>
            {messages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-3 text-sm ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="hover:scale-105 transition-transform">
                    <AvatarFallback>AI</AvatarFallback>
                    <AvatarImage src="https://nossomeio.com.br/wp-content/themes/2024/690/0/crop/2021/07/LogoGrupoMalwee.jpeg" />
                  </Avatar>
                )}

                <div className={`max-w-[70%] px-4 py-2 rounded-xl shadow-md whitespace-pre-wrap break-words ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-muted text-foreground rounded-bl-none'
                }`}>
                  <span className="block font-semibold mb-1 text-xs opacity-80">
                    {message.role === 'user' ? 'Você' : 'Assistente Virtual'}
                  </span>
                  {message.content}
                </div>

                {message.role === 'user' && (
                  <Avatar className="hover:scale-105 transition-transform">
                    <AvatarFallback>GT</AvatarFallback>
                    <AvatarImage src="https://github.com/glatztp.png" />
                  </Avatar>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>

      <CardFooter>
        <form className="w-full flex gap-2 items-center" onSubmit={handleSubmit}>
          <Input
            placeholder="Digite sua pergunta..."
            value={input}
            onChange={handleInputChange}
            className="flex-1 focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(new Event('submit') as any)
              }
            }}
          />
          <Button type="submit" disabled={isLoading} className="transition-all">
            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Enviar'}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
