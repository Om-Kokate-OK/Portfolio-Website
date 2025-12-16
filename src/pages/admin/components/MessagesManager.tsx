import { useState, useEffect } from 'react';
import { Mail, Trash2, Eye, X, Loader } from 'lucide-react';
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
    if (!confirm('Are you sure you want to delete this message?')) return;

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
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  const unreadCount = messages.filter((msg) => !msg.read).length;

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-cyan-500 text-white text-sm rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
        <p className="text-gray-400">Contact form submissions from your portfolio</p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 rounded-xl border border-slate-800">
          <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`bg-slate-900 rounded-xl p-6 border transition-all cursor-pointer ${message.read
                ? 'border-slate-800 hover:border-slate-700'
                : 'border-cyan-500/50 bg-slate-900/50'
                }`}
              onClick={() => openMessage(message)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {!message.read && (
                      <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                    )}
                    <h3 className="text-lg font-bold text-white">{message.name}</h3>
                    <span className="text-gray-500 text-sm">{message.email}</span>
                  </div>
                  {message.subject && (
                    <p className="text-gray-400 mb-2">
                      <span className="font-medium">Subject:</span> {message.subject}
                    </p>
                  )}
                  <p className="text-gray-400 line-clamp-2">{message.message}</p>
                  <p className="text-gray-500 text-sm mt-3">{formatDate(message.created_at)}</p>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openMessage(message);
                    }}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5 text-cyan-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(message._id);
                    }}
                    className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-800">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Message Details</h2>
              <button onClick={closeMessage} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">From</label>
                <p className="text-lg text-white">{selectedMessage.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-lg text-cyan-400 hover:text-cyan-300"
                >
                  {selectedMessage.email}
                </a>
              </div>

              {selectedMessage.subject && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                  <p className="text-lg text-white">{selectedMessage.subject}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-white whitespace-pre-line leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Received</label>
                <p className="text-white">{formatDate(selectedMessage.created_at)}</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-6 flex justify-between">
              <button
                onClick={() => handleDelete(selectedMessage._id)}
                className="flex items-center space-x-2 px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete Message</span>
              </button>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`}
                className="flex items-center space-x-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>Reply via Email</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
