import { useState, useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";

const ChatBox = ({ currentUserId, receiverId, receiverName, onClose }) => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to the bottom when a new message arrives
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Load conversation history between current user and the farmer
    useEffect(() => {
        if (!currentUserId || !receiverId) return;
        
        setLoading(true);
        fetch(`http://localhost:2829/api/v1/messages/conversation?user1=${currentUserId}&user2=${receiverId}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load messages");
                return res.json();
            })
            .then(data => {
                setMessages(data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching chat history:", err);
                setLoading(false);
            });
    }, [currentUserId, receiverId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const payload = {
            senderId: currentUserId,
            receiverId: receiverId,
            content: newMessage.trim()
        };

        try {
            const response = await fetch("http://localhost:2829/api/v1/messages", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Could not send message");

            const savedMessage = await response.json();
            setMessages(prev => [...prev, savedMessage]);
            setNewMessage("");
        } catch (err) {
            console.error("Error sending message:", err);
            alert(t("networkError"));
        }
    };

    return (
        <div className="fixed bottom-5 right-5 w-[340px] md:w-[380px] bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgba(6,78,59,0.15)] flex flex-col h-[500px] z-50 overflow-hidden animate-fadeIn transition-all duration-300">
            
            {/* Chat Premium Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 p-4 text-white flex justify-between items-center border-b border-emerald-900/20 shadow-sm shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center relative border border-white/10 shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-amber-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-emerald-800 rounded-full animate-pulse" />
                    </div>
                    <div>
                        <span className="text-[10px] text-emerald-200 uppercase font-black tracking-wider block">{t("contact")}</span>
                        <h3 className="font-extrabold text-sm text-white truncate max-w-[180px] md:max-w-[220px]">{receiverName || "កសិករខ្មែរ"}</h3>
                    </div>
                </div>
                <button 
                    onClick={onClose} 
                    className="text-white hover:text-red-200 transition duration-200 bg-white/10 hover:bg-white/20 w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer active:scale-90"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            {/* Chat Messages Scrolling Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-[13px]">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                        <div className="w-6 h-6 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-bold tracking-wide">{t("loading")}</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center px-6 gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.083.205.13.431.13.669v.322c0 2.413-1.871 4.39-4.215 4.542a24.42 24.42 0 0 1-3.15.174c-1.11.02-2.22.008-3.327-.034a18.505 18.505 0 0 1-3.153-.307C4.166 13.574 2.25 11.534 2.25 9.16v-.322c0-.238.047-.464.13-.669m17.87 0A22.947 22.947 0 0 0 12 5.25c-2.766 0-5.4.418-7.87 1.191m17.87 0v1.657a4.07 4.07 0 0 1-1.135 2.731l-2.133 2.133a4.07 4.07 0 0 1-2.731 1.135H6.135a4.07 4.07 0 0 1-2.731-1.135L1.27 10.9A4.07 4.07 0 0 1 .135 8.168V6.508" />
                            </svg>
                        </div>
                        <span className="font-medium text-xs leading-relaxed max-w-[240px]">
                            មិនទាន់មានសារឡើយ។ ចាប់ផ្តើមការសន្ទនាដោយផ្ញើសារទៅកាន់អ្នកលក់។
                        </span>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = String(msg.senderId) === String(currentUserId);
                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fadeIn`}>
                                <div className={`p-3 rounded-2xl max-w-[82%] leading-relaxed shadow-[0_2px_4px_rgba(0,0,0,0.02)] break-words font-medium ${
                                    isMe 
                                        ? 'bg-emerald-800 text-white rounded-tr-none shadow-emerald-900/10' 
                                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                                }`}>
                                    {msg.content}
                                </div>
                                <span className="text-[9px] text-slate-400 mt-1 px-1.5">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Action Input Footer Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2 items-center shrink-0">
                <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t("messagePlaceholder")}
                    className="flex-1 border border-slate-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-700/5 font-medium bg-slate-50 transition"
                />
                <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className={`p-3 rounded-xl transition duration-200 shadow-sm active:scale-95 flex items-center justify-center shrink-0 cursor-pointer ${
                        newMessage.trim() 
                            ? 'bg-emerald-800 text-white hover:bg-emerald-700' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                </button>
            </form>

        </div>
    );
};

export default ChatBox;