import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bot, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

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
    <div className={cn('cockpit-panel p-4', className)}>
      <div className="flex items-center gap-2 mb-3 border-b border-border pb-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
          <Bot className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-display text-primary">AI CO-PILOT</h3>
          <p className="text-[10px] text-muted-foreground">FLIGHT ADVISORY SYSTEM</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] text-success">ONLINE</span>
        </div>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {displayedMessages.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Systems nominal. Ready for commands.</p>
          </div>
        ) : (
          displayedMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'ai-alert animate-fade-in-up',
                msg.type === 'info' && 'ai-alert-info',
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
