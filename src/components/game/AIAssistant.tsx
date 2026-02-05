import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bot, AlertTriangle, CheckCircle, Info, XCircle, Anchor } from 'lucide-react';

interface AIMessage {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  message: string;
  timestamp: Date;
}

interface AIAssistantProps {
  messages: AIMessage[];
  className?: string;
}

export function AIAssistant({ messages, className }: AIAssistantProps) {
  const [displayedMessages, setDisplayedMessages] = useState<AIMessage[]>([]);

  useEffect(() => {
    setDisplayedMessages(messages);
  }, [messages]);

  const getIcon = (type: AIMessage['type']) => {
    switch (type) {
      case 'info':
        return <Info className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'danger':
        return <XCircle className="w-4 h-4" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn('bridge-panel border-cyan-500/30 p-4', className)}>
      <div className="flex items-center gap-2 mb-3 border-b border-border pb-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.5)]">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-display text-cyan-400">BRIDGE ADVISOR</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Deep Sea Monitoring</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] text-cyan-400 font-bold">ONLINE</span>
        </div>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {displayedMessages.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            <Anchor className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-[10px] uppercase font-display">Awaiting sensor data...</p>
          </div>
        ) : (
          displayedMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'ai-alert animate-fade-in-up border-l-4',
                msg.type === 'info' && 'bg-cyan-500/10 border-cyan-500 text-cyan-100',
                msg.type === 'warning' && 'ai-alert-warning',
                msg.type === 'danger' && 'ai-alert-danger',
                msg.type === 'success' && 'ai-alert-success'
              )}
            >
              <div className="flex items-start gap-2">
                {getIcon(msg.type)}
                <p className="text-sm flex-1">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
