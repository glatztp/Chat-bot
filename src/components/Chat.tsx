"use client";

import { useChat } from "ai/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Loader2, ImagePlus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../public/Logo.png";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
  } = useChat({
    api: "api/chat",
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [initialMessageSent, setInitialMessageSent] = useState(false);

  useEffect(() => {
    if (!initialMessageSent && messages.length === 0) {
      append({
        id: "init-message",
        role: "assistant",
        content: "Olá! Sou seu assistente virtual. Como posso te ajudar hoje?",
      });
      setInitialMessageSent(true);
    }
  }, [append, messages, initialMessageSent]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const remaining = 3 - imageFiles.length;
    const selected = files.slice(0, remaining);
    const previews = selected.map((file) => URL.createObjectURL(file));
    setImageFiles((prev) => [...prev, ...selected]);
    setImagePreviews((prev) => [...prev, ...previews]);
  }

  function removeImage(index: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = input.trim();
    if (!content && imageFiles.length === 0) return;
    let fullContent = content;
    if (replyTo) {
      fullContent = `Respondendo a:\n"${replyTo}"\n\n${content}`;
    }
    if (imagePreviews.length > 0) {
      const imageMarkdown = imagePreviews
        .map((url) => `![imagem](${url})`)
        .join("\n");
      fullContent += "\n" + imageMarkdown;
    }
    append({
      id: Date.now().toString(),
      role: "user",
      content: fullContent.trim(),
    });
    setReplyTo(null);
    setImageFiles([]);
    setImagePreviews([]);
    handleInputChange({ target: { value: "" } } as any);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl rounded-2xl border border-border bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex gap-2 items-center">
          <img src={Logo.src} className="h-10 w-auto rounded-full" />
          Chat Assistente
        </CardTitle>
        <CardDescription className="text-muted-foreground ml-12">
          Fale com o assistente, envie textos ou imagens e tire suas dúvidas!
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div
          ref={scrollRef}
          className="h-[60vh] overflow-y-auto pr-2 scroll-smooth space-y-4"
        >
          <AnimatePresence initial={false}>
            {messages.map((message) => {
              const imgRegex = /!\[.*?\]\((.*?)\)/g;
              const parts = message.content.split(imgRegex);
              return (
                <motion.div
                  key={message.id}
                  onClick={() => setReplyTo(message.content)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-3 text-sm ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Avatar>
                      <AvatarFallback>AI</AvatarFallback>
                      <AvatarImage src={Logo.src} />
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-xl shadow-2xl whitespace-pre-wrap break-words space-y-2 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white rounded-tr-none"
                        : "bg-muted text-foreground rounded-bl-none"
                    }`}
                  >
                    <span className="block font-semibold mb-1 text-xs opacity-80">
                      {message.role === "user" ? "Você" : "Assistente Virtual"}
                    </span>
                    {parts.map((part, idx) =>
                      idx % 2 === 0 ? (
                        part.trim() && <p key={idx}>{part}</p>
                      ) : (
                        <img
                          key={idx}
                          src={part}
                          alt="imagem"
                          className="rounded-md border w-32 hover:scale-105 transition-transform"
                        />
                      )
                    )}
                  </div>
                  {message.role === "user" && (
                    <Avatar>
                      <AvatarFallback>GT</AvatarFallback>
                      <AvatarImage src="https://github.com/glatztp.png" />
                    </Avatar>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {imagePreviews.length > 0 && (
            <div className="flex gap-3 flex-wrap justify-end mt-2">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    title="Remover"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 items-stretch">
        {replyTo && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded-lg flex items-center justify-between">
            <span className="italic truncate">
              Respondendo: "{replyTo.slice(0, 80)}..."
            </span>
            <button
              onClick={() => setReplyTo(null)}
              className="ml-4 text-red-500 hover:underline text-xs"
            >
              Cancelar
            </button>
          </div>
        )}
        <form
          onSubmit={handleCustomSubmit}
          className="w-full flex gap-2 items-center"
        >
          <label
            className={`cursor-pointer ${
              imageFiles.length >= 3
                ? "opacity-50 pointer-events-none"
                : "hover:opacity-80"
            }`}
            title="Anexar imagem"
          >
            <ImagePlus className="w-5 h-5 text-muted-foreground mr-4 text-blue-500" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              multiple
              disabled={imageFiles.length >= 3}
            />
          </label>
          <Input
            placeholder="Digite sua pergunta..."
            value={input}
            onChange={handleInputChange}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCustomSubmit(new Event("submit") as any);
              }
            }}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white hover:bg-blue-400"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Enviar"
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
