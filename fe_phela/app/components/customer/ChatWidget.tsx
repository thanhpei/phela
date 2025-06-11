import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getChatHistory } from '~/services/chatServices'; 
import { useAuth, isCustomerUser } from '~/AuthContext';

interface ChatMessage {
    id?: string;
    content: string;
    senderId: string;
    recipientId: string;
    senderName: string;
}

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const stompClientRef = useRef<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();

    const disconnect = useCallback(() => {
        if (stompClientRef.current) {
            stompClientRef.current.deactivate();
            stompClientRef.current = null;
        }
    }, []);

    const connect = useCallback((currentCustomerId: string) => {
        if (stompClientRef.current) return;

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                console.log('Connected to chat server!');
                client.subscribe(`/topic/chat/${currentCustomerId}`, (message) => {
                    const receivedMessage: ChatMessage = JSON.parse(message.body);
                    
                    setMessages((prev) => {
                        if (prev.some(msg => msg.id === receivedMessage.id)) return prev;
                        return [...prev, receivedMessage];
                    });
                });
            },
            reconnectDelay: 5000,
        });
        client.activate();
        stompClientRef.current = client;
    }, []);

    useEffect(() => {
        if (isOpen && user && isCustomerUser(user)) {
            const customerId = user.customerId;
            const setupChat = async () => {
                try {
                    const history = await getChatHistory(customerId);
                    setMessages(history);
                } catch (error) {
                    console.error("Failed to load chat history", error);
                }
                connect(customerId);
            };
            setupChat();
        } else {
            disconnect();
        }
        
        return () => disconnect();
    }, [isOpen, user, connect, disconnect]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!user || !isCustomerUser(user)) {
        return null; 
    }
    
    const { customerId, username: customerName } = user;

    const handleSendMessage = () => {
        if (inputValue.trim() && stompClientRef.current?.connected) {
            const tempId = `temp_${Date.now()}`;
            const chatMessage: ChatMessage = {
                id: tempId,
                content: inputValue,
                senderId: customerId,
                senderName: customerName,
                recipientId: 'ADMIN',
            };
            
            setMessages((prev) => [...prev, chatMessage]);

            stompClientRef.current.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify({ ...chatMessage, id: null }),
            });
            setInputValue('');
        }
    };
    
    return (
        <>
            {!isOpen ? (
                <button 
                    onClick={() => setIsOpen(true)} 
                    className="fixed bottom-5 right-5 bg-[#d4a373] text-white p-4 rounded-full shadow-lg z-50 hover:shadow-xl transition-all duration-300 hover:scale-110"
                    style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            ) : (
                <div className="fixed bottom-5 right-5 w-80 h-[28rem] bg-white rounded-lg shadow-xl flex flex-col z-50 border border-gray-200 overflow-hidden">
                    <div className="bg-[#d4a373] text-white p-4 flex justify-between items-center rounded-t-lg">
                        <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <h3 className="font-bold text-lg">Hỗ trợ trực tuyến</h3>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="text-white hover:text-gray-200 transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        {messages.map((msg, index) => (
                            <div key={msg.id || index} className={`mb-4 flex ${msg.senderId === customerId ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs rounded-lg p-3 ${msg.senderId === customerId ? 'bg-[#d4a373] text-white rounded-tr-none' : 'bg-gray-200 text-gray-800 rounded-tl-none'}`}>
                                    <p className="text-xs font-semibold mb-1">{msg.senderName}</p>
                                    <p className="text-sm break-words">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-3 border-t border-gray-200 bg-white">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:border-transparent"
                                placeholder="Nhập tin nhắn..."
                            />
                            <button 
                                onClick={handleSendMessage} 
                                className="bg-[#d4a373] text-white p-2 rounded-lg hover:bg-[#c19266] transition-colors duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;