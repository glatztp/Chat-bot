
# 💬 Chat Assistente com IA

Este projeto é um chat moderno, responsivo e estilizado, construído em **React + Next.js** com suporte à API do OpenRouter. Ele oferece uma experiência interativa com temas (claro/escuro), histórico persistente, salvamento, exportação e mais.

## 🚀 Funcionalidades

- Modo escuro/claro com persistência
- Salvamento de conversas no `localStorage`
- Exportação de chats como `.txt`
- Histórico com renomear, excluir e carregar
- Efeitos animados e responsivos
- Chat com suporte a múltiplos temas e mensagens estilizadas

---

## 📦 Tecnologias Usadas

- **Next.js**
- **React**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide Icons**
- **OpenRouter (API compatível com OpenAI)**

---

## ⚙️ Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/nome-do-repo.git
cd nome-do-repo
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn
```

### 3. Configure sua chave da API

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
OPENAI_API_KEY=sua-chave-do-openrouter-aqui
```

🔐 Você pode obter uma chave gratuita ou paga em: https://openrouter.ai/

Se quiser usar diretamente o OpenAI oficial, altere o endpoint e chave conforme a necessidade.

---

## 📂 Estrutura do Projeto

```
/pages
  └── api
      └── chat.ts        # Rota da API que lida com as mensagens
/app
  └── chat.tsx           # Componente principal do chat
/components              # UI Reutilizável
  └── ui/                # Botões, Input, Card, etc.
```

### ▶️ Inicie o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Abra http://localhost:3000 no navegador.

---

## 🛠 Personalizações (opcional)

- Avatar do assistente: edite `/public/bot.png`
- Ajustes de estilo: veja o arquivo `chat.tsx` e modifique o Tailwind
- Componentes reutilizáveis: estão em `/components/ui/`

---

## 🧠 Sugestões de uso

- Use para testes com modelos da OpenAI, Mistral, Claude, Gemini, etc (via OpenRouter)
- Transforme em assistente pessoal com integração de comandos
- Estude boas práticas de interface e persistência

---

## 📃 Licença

Este projeto é livre para uso pessoal e educacional. Sinta-se livre para modificar!

Feito com 💡 por Gabriel Fellipe Glatz
