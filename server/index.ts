import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ingestData, generateRAGResponse } from './geminiRAG';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database Stores
const users: any[] = [];
let chats = [
  {
    id: 'chat_1',
    customerName: 'Amit Kumar',
    source: 'whatsapp',
    avatar: '👨🏽',
    status: 'active',
    lastMessage: 'Hi, I need assistance with the checkout billing issue.',
    timestamp: '10 mins ago',
    unread: true
  },
  {
    id: 'chat_2',
    customerName: 'Sarah Jenkins',
    source: 'webchat',
    avatar: '👩🏼',
    status: 'resolved',
    lastMessage: 'Thank you! The issue is resolved now.',
    timestamp: '1 day ago',
    unread: false
  },
  {
    id: 'chat_3',
    customerName: 'David Lee',
    source: 'email',
    avatar: '👨🏻',
    status: 'active',
    lastMessage: 'Requesting escalation for SLA breach regarding pricing.',
    timestamp: '30 mins ago',
    unread: false
  }
];

const messages: Record<string, any[]> = {
  'chat_1': [
    { id: 'm1', sender: 'customer', text: 'Hello, I am having trouble with checking out.', timestamp: '10:15 AM' },
    { id: 'm2', sender: 'agent', text: 'Hi Amit! Welcome to support. Let me check that for you. What error are you seeing?', timestamp: '10:16 AM' },
    { id: 'm3', sender: 'customer', text: 'Hi, I need assistance with the checkout billing issue. It says card declined.', timestamp: '10:20 AM' }
  ],
  'chat_2': [
    { id: 'm4', sender: 'customer', text: 'Can I upgrade my subscription plan via PayPal?', timestamp: 'Yesterday' },
    { id: 'm5', sender: 'agent', text: 'Yes, we support Stripe and PayPal payments. I can send you a direct link.', timestamp: 'Yesterday' },
    { id: 'm6', sender: 'customer', text: 'Thank you! The issue is resolved now.', timestamp: 'Yesterday' }
  ],
  'chat_3': [
    { id: 'm7', sender: 'customer', text: 'My subscription hasn\'t been upgraded even after payment.', timestamp: '30 mins ago' }
  ]
};

// 1. Sanity Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'IndraAssist Backend'
  });
});

// 2. Authentication Endpoints
app.post('/api/auth/signup', (req, res) => {
  const { email, name, company, industry, plan } = req.body;
  
  if (!email || !name) {
    return res.status(400).json({ error: 'Name and Email are required' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: `user_${Date.now()}`,
    email,
    name,
    company: company || 'My Startup Ltd',
    industry: industry || 'Technology',
    plan: plan || 'growth',
    logo: '🚀'
  };

  users.push(newUser);
  console.log(`[Auth] User registered: ${email}`);
  
  return res.status(201).json({
    message: 'User registered successfully',
    user: newUser
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  let user = users.find(u => u.email === email);

  // For testing ease, if user doesn't exist, we can register them on the fly
  if (!user) {
    user = {
      id: `user_${Date.now()}`,
      email,
      name: 'Priya Sharma',
      company: 'TechCorp Solutions',
      industry: 'Technology',
      plan: 'growth',
      logo: '🏢'
    };
    users.push(user);
    console.log(`[Auth] Auto-registered test user: ${email}`);
  } else {
    console.log(`[Auth] User logged in: ${email}`);
  }

  return res.status(200).json({
    message: 'Login successful',
    user
  });
});

// 3. Live Chat Endpoints
app.get('/api/chats', (req, res) => {
  return res.status(200).json(chats);
});

app.post('/api/chats', (req, res) => {
  const { customerName, source, lastMessage, avatar } = req.body;
  if (!customerName || !source) {
    return res.status(400).json({ error: 'Customer name and source are required' });
  }

  const newChat = {
    id: `chat_${Date.now()}`,
    customerName,
    source,
    avatar: avatar || '👤',
    status: 'active',
    lastMessage: lastMessage || 'Chat started',
    timestamp: 'Just now',
    unread: false
  };

  chats.unshift(newChat);
  messages[newChat.id] = lastMessage ? [{
    id: `msg_${Date.now()}`,
    sender: 'customer',
    text: lastMessage,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }] : [];

  return res.status(201).json(newChat);
});

app.get('/api/messages/:chatId', (req, res) => {
  const { chatId } = req.params;
  const chatMessages = messages[chatId] || [];
  return res.status(200).json(chatMessages);
});

app.post('/api/messages/:chatId', (req, res) => {
  const { chatId } = req.params;
  const { sender, text } = req.body;

  if (!sender || !text) {
    return res.status(400).json({ error: 'Sender and text are required' });
  }

  if (!messages[chatId]) {
    messages[chatId] = [];
  }

  const newMsg = {
    id: `msg_${Date.now()}`,
    sender,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  messages[chatId].push(newMsg);

  // Update last message in the chat
  const chat = chats.find(c => c.id === chatId);
  if (chat) {
    chat.lastMessage = text;
    chat.timestamp = 'Just now';
  }

  // Trigger dynamic Gemini RAG auto-reply if the sender is user/customer
  if (sender === 'customer') {
    (async () => {
      try {
        const aiResponseText = await generateRAGResponse(text, 'TechCorp Solutions', 'Technology');
        const aiReply = {
          id: `msg_ai_${Date.now()}`,
          sender: 'agent',
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        messages[chatId].push(aiReply);
        if (chat) {
          chat.lastMessage = aiReply.text;
          chat.timestamp = 'Just now';
        }
      } catch (err) {
        console.error('❌ [Server] Error generating automatic response:', err);
      }
    })();
  }

  return res.status(201).json(newMsg);
});

// 4. Data Ingestion Endpoint
app.post('/api/data/ingest', async (req, res) => {
  const { id, text, category, metadata } = req.body;
  if (!id || !text || !category) {
    return res.status(400).json({ error: 'id, text, and category are required' });
  }
  try {
    await ingestData(id, text, category, metadata || {});
    return res.status(200).json({ message: 'Ingestion completed successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Ingestion failed' });
  }
});

app.listen(PORT, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${PORT}`);
});
