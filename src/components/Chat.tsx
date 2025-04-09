"use client";

import { useChat, type Message } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sun,
  Moon,
  Loader2,
  Send,
  Trash2,
  MessageSquare,
  Save,
  Pencil,
  FileDown,
  X,
} from "lucide-react";

type SavedChat = {
  title: string;
  messages: { id: string; role: "user" | "assistant"; content: string }[];
};

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({ api: "api/chat" });

  const scrollRef = useRef<HTMLDivElement>(null);

  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [savedChats, setSavedChats] = useState<SavedChat[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedChats");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [selectedChatIndex, setSelectedChatIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    }
  }, [darkMode]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
    setIsTyping(isLoading);
  }, [messages, isLoading]);

  const getAutoTitle = () => {
    const text = messages
      .map((msg) => msg.role === "user" ? msg.content : "")
      .join(" ")
      .slice(0, 30)
      .replace(/\s+/g, " ")
      .trim();
    return text || "Nova Conversa";
  };

  const saveChat = () => {
    const filtered = messages.filter(m => m.role === "user" || m.role === "assistant");
    const formattedMessages = filtered.map(m => ({
      id: m.id || crypto.randomUUID(),
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
    const newChat: SavedChat = { title: getAutoTitle(), messages: formattedMessages };
    const newSavedChats = [...savedChats, newChat];
    setSavedChats(newSavedChats);
    localStorage.setItem("savedChats", JSON.stringify(newSavedChats));
  };

  const deleteChat = (index: number) => {
    const updated = savedChats.filter((_, i) => i !== index);
    setSavedChats(updated);
    localStorage.setItem("savedChats", JSON.stringify(updated));
    setShowModal(false);
  };

  const renameChat = (index: number, newTitle: string) => {
    const updated = [...savedChats];
    updated[index].title = newTitle;
    setSavedChats(updated);
    localStorage.setItem("savedChats", JSON.stringify(updated));
    setShowModal(false);
  };

  const exportChat = (index: number) => {
    const chat = savedChats[index];
    const text = chat.messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chat.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowModal(false);
  };

  const openOptionsModal = (index: number) => {
    setSelectedChatIndex(index);
    setModalTitle(savedChats[index].title);
    setShowModal(true);
  };

  return (
    <div className={`${darkMode ? "dark" : ""} relative w-full min-h-screen bg-muted/40 flex flex-col md:flex-row`}>
      
      {/* Sidebar */}
      <div className={`fixed md:relative inset-y-0 left-0 z-20 transform ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"} transition-transform duration-300 ease-in-out w-64 bg-background border-r border-border p-4 shadow-lg`}>
        <h2 className="text-lg font-semibold mb-4">Histórico</h2>
        {savedChats.length > 0 ? (
          <ul>
            {savedChats.map((chat, index) => (
              <li key={index} className="mb-2 flex justify-between items-center">
                <button onClick={() => setMessages(chat.messages)} className="text-blue-500 hover:underline text-left flex-1 truncate">
                  {chat.title}
                </button>
                <Button size="icon" variant="ghost" onClick={() => openOptionsModal(index)}>
                  <Pencil className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma conversa salva.</p>
        )}
        <Button onClick={() => setShowSidebar(false)} className="mt-4 w-full md:hidden">Fechar</Button>
      </div>

      {/* Modal */}
      {showModal && selectedChatIndex !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-md space-y-4"
          >
            <h3 className="text-lg font-semibold">Editar Conversa</h3>
            <Input
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
              placeholder="Novo título"
            />
            <div className="flex flex-wrap gap-2 justify-end">
              <Button onClick={() => renameChat(selectedChatIndex, modalTitle)}>Renomear</Button>
              <Button onClick={() => exportChat(selectedChatIndex)} variant="outline">
                <FileDown className="w-4 h-4 mr-1" /> Exportar
              </Button>
              <Button onClick={() => deleteChat(selectedChatIndex)} variant="destructive">
                <Trash2 className="w-4 h-4 mr-1" /> Deletar
              </Button>
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                <X />
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Chat Principal */}
      <main className="flex-1 flex flex-col items-center justify-start pt-6 px-2 sm:px-4 pb-10">
        <Card className="w-full max-w-3xl bg-background/80 backdrop-blur-lg border border-border rounded-xl shadow-xl flex flex-col h-full">
          <CardHeader className="flex flex-col gap-2 pb-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">Chat Assistente</CardTitle>
                <CardDescription className="text-muted-foreground">Converse com sua IA de forma moderna</CardDescription>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={saveChat}>
                  <Save className="w-5 h-5 text-green-600" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setMessages([])}>
                  <Trash2 className="w-5 h-5 text-destructive" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowSidebar(true)} className="md:hidden">
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative flex-1 overflow-hidden">
            <div ref={scrollRef} className="max-h-[400px] sm:max-h-[500px] overflow-y-auto px-2 py-2 space-y-6">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-3 text-sm ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="mt-1 hover:scale-105 transition-transform">
                        <AvatarImage src="/bot.png" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === "user" ? "bg-blue-600 text-white ml-auto" : "bg-muted"}`}>
                      {message.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
              <Input
                placeholder="Digite sua mensagem"
                value={input}
                onChange={handleInputChange}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
