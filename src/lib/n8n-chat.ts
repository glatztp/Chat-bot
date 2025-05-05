"use client";
import { createChat } from '@n8n/chat'

createChat({
  webhookUrl: 'http://localhost:3000/api/chat'
})
