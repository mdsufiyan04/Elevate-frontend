import React, { useEffect, useState, useRef } from 'react';
import { Paperclip, Send, Search, ArrowLeft, MessageSquare } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import { getMyExchanges, getMessages, sendMessage } from '../api/services';
import { useAuth } from '../context/AuthContext';

const formatTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const Chat = () => {
  const { user } = useAuth();
  const [exchanges, setExchanges] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMobileList, setIsMobileList] = useState(true);
  const messagesEndRef = useRef(null);

  const getPartner = (exchange) => {
    if (!exchange || !user) return null;
    return exchange.user1Id === user.id ? exchange.user2 : exchange.user1;
  };

  useEffect(() => {
    getMyExchanges()
      .then(res => {
        setExchanges(res.data);
        if (res.data.length > 0) setSelectedExchange(res.data[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedExchange) return;
    const fetchMessages = () => {
      getMessages(selectedExchange.id).then(res => setMessages(res.data)).catch(console.error);
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedExchange]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedExchange) return;
    try {
      await sendMessage(selectedExchange.id, newMessage);
      setNewMessage('');
      const res = await getMessages(selectedExchange.id);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-apple-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const partner = selectedExchange ? getPartner(selectedExchange) : null;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-apple-black">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex gap-6 h-[calc(100vh-64px)]">
        <div className={`w-full md:w-1/3 bg-white rounded-[24px] border border-apple-border flex flex-col ${!isMobileList && 'hidden md:flex'}`}>
          <div className="p-6 border-b border-apple-border">
            <h2 className="text-[24px] font-semibold text-apple-black mb-4 tracking-[-0.01em]">Messages</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-gray" />
              <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-3 bg-apple-bg border border-apple-border rounded-[12px] text-[14px] focus:outline-none focus:border-apple-black transition-colors placeholder-apple-gray" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {exchanges.length === 0 ? (
              <div className="text-center py-12 px-4 text-apple-gray text-[14px]">No active exchanges yet</div>
            ) : (
              exchanges.map((exchange) => {
                const chatPartner = getPartner(exchange);
                const mySkill = exchange.user1Id === user?.id ? exchange.user1Skill : exchange.user2Skill;
                const theirSkill = exchange.user1Id === user?.id ? exchange.user2Skill : exchange.user1Skill;
                return (
                  <div
                    key={exchange.id}
                    onClick={() => { setSelectedExchange(exchange); setIsMobileList(false); }}
                    className={`flex items-center gap-4 p-4 rounded-[16px] cursor-pointer transition-colors ${selectedExchange?.id === exchange.id ? 'bg-apple-bg border border-apple-border' : 'hover:bg-apple-bg border border-transparent'}`}
                  >
                    <img src={chatPartner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chatPartner?.username}`} className="w-12 h-12 rounded-full border border-apple-border" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-apple-black truncate text-[15px] tracking-tight">{chatPartner?.name}</h4>
                      </div>
                      <p className="text-[11px] font-bold text-apple-gray uppercase tracking-[0.08em] truncate">{mySkill} ↔ {theirSkill}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={`flex-1 bg-white rounded-[24px] border border-apple-border flex flex-col ${isMobileList && 'hidden md:flex'}`}>
          {!selectedExchange ? (
            <div className="flex-1 flex items-center justify-center text-apple-gray flex-col gap-4">
              <div className="w-16 h-16 bg-apple-bg rounded-[18px] flex items-center justify-center border border-apple-border">
                <MessageSquare className="w-8 h-8 text-apple-gray" />
              </div>
              <span className="text-[14px] uppercase tracking-[0.08em] font-medium">Select a conversation</span>
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-apple-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsMobileList(true)} className="md:hidden p-2 text-apple-gray hover:text-apple-black rounded-lg">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <img src={partner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner?.username}`} className="w-12 h-12 rounded-full border border-apple-border" alt="" />
                  <div>
                    <h3 className="font-bold text-apple-black text-[17px] tracking-tight">{partner?.name}</h3>
                    <p className="text-[12px] font-semibold text-apple-gray uppercase tracking-[0.08em] mt-0.5">
                      Exchange: {selectedExchange.user1Id === user?.id ? selectedExchange.user1Skill : selectedExchange.user2Skill} ↔ {selectedExchange.user1Id === user?.id ? selectedExchange.user2Skill : selectedExchange.user1Skill}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                  <p className="text-center text-apple-gray text-[14px] py-8">No messages yet. Start the conversation!</p>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = msg.senderId === user?.id;
                    const sender = msg.senderId === selectedExchange.user1Id ? selectedExchange.user1 : selectedExchange.user2;
                    return (
                      <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isMe ? (
                          <img src={sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender?.username}`} className="w-8 h-8 rounded-full flex-shrink-0 border border-apple-border self-end mb-5" alt="" />
                        ) : null}
                        <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`px-5 py-3 rounded-[20px] text-[15px] font-medium leading-relaxed shadow-sm ${isMe ? 'bg-[#0A84FF] text-white rounded-tr-[4px]' : 'bg-[#FBFBFD] border border-apple-border text-apple-black rounded-tl-[4px]'}`}>
                            {msg.text}
                          </div>
                          <span className="text-[11px] font-bold text-apple-gray tracking-[0.08em] mt-2">{formatTime(msg.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-apple-border bg-white rounded-b-[24px]">
                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                  <button className="p-3.5 text-apple-gray hover:text-apple-black transition-colors rounded-full hover:bg-apple-bg active:scale-95">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 bg-[#FBFBFD] border border-apple-border shadow-sm rounded-[24px] px-5 py-2 flex items-center focus-within:border-black focus-within:ring-4 focus-within:ring-black/5 transition-all">
                    <textarea
                      placeholder="Message..."
                      className="w-full bg-transparent border-none outline-none resize-none max-h-32 text-[15px] font-medium text-apple-black py-2.5 placeholder-apple-gray"
                      rows="1"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    ></textarea>
                  </div>
                  <button onClick={handleSend} disabled={!newMessage.trim()} className="p-3.5 bg-[#0A84FF] disabled:opacity-50 text-white rounded-full hover:bg-[#007AFF] transition-all active:scale-95 flex items-center justify-center">
                    <Send className="w-5 h-5 ml-0.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;
