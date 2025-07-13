import React, { useState, useRef, useEffect } from 'react';
import { Store, Rack } from '../../types';
import { getChatResponse } from '../../services/geminiService';
import { Send, Bot, User, MessageCircle } from 'lucide-react';

interface ChatInterfaceProps {
  racks: Rack[];
  shoppingList: string[];
  store: Store;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ racks, shoppingList, store }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! Welcome to ${store.name}. I'm your AI shopping assistant. I can help you find products, suggest items, and guide you through the store. What can I help you with today?`,
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await getChatResponse(inputText, { racks });
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    "Where can I find milk?",
    "Show me the bakery section",
    "What's in the electronics area?",
    "Help me find fresh produce"
  ];

  const handleQuickAction = (action: string) => {
    setInputText(action);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <MessageCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Shopping Assistant</h2>
            <p className="text-sm text-gray-600">Ask me anything about the store</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div className={`rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
          <div className="grid grid-cols-1 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask me about products, locations, or anything else..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};