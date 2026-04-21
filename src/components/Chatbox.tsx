import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'nvidia/nemotron-3-super-120b-a12b:free';
const SYSTEM_PROMPT = `You are a friendly AI assistant for a HYROX fitness aggregation platform called HYROX Hub. 

Your role is to help users find:
- HYROX fitness classes (Foundation, Endurance, Skills, Simulation)
- Gym locations with facilities (Showers, Sauna, Ice Baths, Parking)
- Certified instructors/coaches
- Training tips and event information

Guidelines:
- Be concise and encouraging
- Use bullet points for multiple options
- If you don't have specific data, suggest general HYROX training advice
- Always be supportive and fitness-oriented
- Keep responses under 3 sentences for quick answers`;

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hi! I can help you find the perfect HYROX class, instructor, or gym. What are you looking for?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = messages
        .filter(m => m.id !== '1')
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin || 'https://hyrox-hub.com',
          'X-Title': 'HYROX Hub',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory,
            { role: 'user', content: input }
          ],
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantContent = data.choices?.[0]?.message?.content || 'Sorry, I could not process that request.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] flex flex-col shadow-2xl border-border bg-card z-50">
      <CardHeader className="p-4 border-b border-border flex flex-row items-center justify-between bg-muted rounded-t-xl">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
          <Bot className="h-5 w-5" />
          HYROX Assistant
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-muted text-foreground rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="px-3 py-2 rounded-lg bg-muted text-foreground rounded-tl-none flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t border-border bg-muted rounded-b-xl flex gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about classes..."
            className="bg-background border-border focus-visible:ring-primary"
          />
          <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
