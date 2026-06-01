import { useState, useEffect } from 'react';
import { Mail, Trash2, Eye, X, Loader, CornerDownRight } from 'lucide-react';
import { api } from '../../../lib/api';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function MessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/contact');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const openMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);

    if (!message.read) {
      try {
        await api.put(`/contact/${message._id}`, { read: true });
        setMessages((prev) =>
          prev.map((msg) => (msg._id === message._id ? { ...msg, read: true } : msg))
        );
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const closeMessage = () => {
    setSelectedMessage(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message record?')) return;

    try {
      await api.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      if (selectedMessage?._id === id) {
        closeMessage();
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 font-mono text-xs uppercase tracking-widest text-[#888888]">
        <Loader className="w-8 h-8 animate-spin text-white mr-3" />
        <span>Fetching inbox queues...</span>
      </div>
    );
  }

  const unreadCount = messages.filter((msg) => !msg.read).length;

  return (
    <div className="max-w-6xl mx-auto space-y-12 select-none font-mono">
      
      {/* Title & Setup Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8 relative">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-[#888888]">/ Port Inbox Streams</span>
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">SYS_MESSAGES</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-1 border border-white text-white text-[10px] font-black uppercase tracking-widest bg-white/5 animate-pulse">
                {unreadCount} UNREAD
              </span>
            )}
          </div>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-none bg-black">
          <Mail className="w-12 h-12 text-[#888888] mx-auto mb-4" />
          <p className="text-xs uppercase tracking-widest text-[#888888]">No dynamic message queues logged.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`bg-black p-6 border transition-all cursor-pointer rounded-none relative group flex flex-col justify-between ${
                message.read
                  ? 'border-white/10 hover:border-white'
                  : 'border-white bg-white/5'
              }`}
              onClick={() => openMessage(message)}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    {!message.read && (
                      <span className="w-1.5 h-1.5 bg-white shrink-0"></span>
                    )}
                    <h3 className="text-sm font-black text-white uppercase">{message.name}</h3>
                    <span className="text-[#888888] text-[10px] tracking-wider font-light">({message.email})</span>
                  </div>
                  
                  {message.subject && (
                    <p className="text-xs text-slate-300">
                      <span className="text-[#888888] uppercase tracking-wider font-bold">Subject:</span> {message.subject.toUpperCase()}
                    </p>
                  )}
                  <p className="text-[#888888] text-xs font-light line-clamp-1">{message.message}</p>
                  <p className="text-[9px] text-slate-500 tracking-wider pt-2">{formatDate(message.created_at)}</p>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openMessage(message);
                    }}
                    className="p-2 border border-white/10 hover:border-white text-slate-400 hover:text-white transition-all bg-transparent"
                    title="Read Message"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(message._id);
                    }}
                    className="p-2 border border-red-500/20 text-red-500 hover:border-red-500 hover:bg-red-500/10 transition-all"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
          <div className="bg-black border border-white/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-none relative flex flex-col justify-between animate-fadeIn shadow-2xl">
            
            {/* Subtle decorative brutalist corner elements */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-white"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white"></div>

            <div className="sticky top-0 bg-black border-b border-white/10 p-6 flex justify-between items-center z-10">
              <h2 className="text-sm font-black uppercase text-white tracking-widest">/ Port Queue Stream Details</h2>
              <button 
                onClick={closeMessage} 
                className="text-[#888888] hover:text-white p-1 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6 text-xs uppercase tracking-widest text-[#888888]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[8px] tracking-widest text-[#888888] mb-1">/ Sender ID</label>
                  <p className="text-sm font-bold text-white">{selectedMessage.name}</p>
                </div>

                <div>
                  <label className="block text-[8px] tracking-widest text-[#888888] mb-1">/ Sync Coordinates</label>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-sm font-bold text-white hover:underline lowercase tracking-normal flex items-center gap-1.5"
                  >
                    <span>{selectedMessage.email}</span>
                  </a>
                </div>
              </div>

              {selectedMessage.subject && (
                <div>
                  <label className="block text-[8px] tracking-widest text-[#888888] mb-1">/ Topic / Subject</label>
                  <p className="text-sm font-bold text-white">{selectedMessage.subject}</p>
                </div>
              )}

              <div>
                <label className="block text-[8px] tracking-widest text-[#888888] mb-2">/ Message Body Payload</label>
                <div className="bg-[#0b0b0b] border border-white/10 p-6 rounded-none">
                  <p className="text-white whitespace-pre-line leading-relaxed tracking-wide lowercase uppercase-first-letter">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <label className="block text-[8px] tracking-widest text-[#888888] mb-1">/ Timestamp Sync</label>
                  <p className="text-[10px] font-bold text-slate-300">{formatDate(selectedMessage.created_at)}</p>
                </div>
                <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" title="System synchronised"></span>
              </div>
            </div>

            <div className="sticky bottom-0 bg-black border-t border-white/10 p-6 flex flex-col sm:flex-row justify-between gap-4 z-10">
              <button
                onClick={() => handleDelete(selectedMessage._id)}
                className="px-6 py-3 border border-red-500/20 text-red-500 hover:border-red-500 hover:bg-red-500/10 transition-all text-xs font-black uppercase tracking-widest"
              >
                Delete Stream
              </button>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Portfolio Inquiry'}`}
                className="px-8 py-3.5 border border-white bg-white hover:bg-black text-black hover:text-white font-black uppercase text-xs tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
              >
                <CornerDownRight className="w-4 h-4" />
                <span>Reply Coordinate</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
