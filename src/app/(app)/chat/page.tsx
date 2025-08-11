import { ChatInterface } from '@/components/chat/chat-interface';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">AI Financial Advisor</h1>
        <p className="text-muted-foreground">Ask me anything about your finances or retirement planning.</p>
      </div>
      <ChatInterface />
    </div>
  );
}
