import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getChatHistory } from '~/services/chatServices'; 
import { useAuth, isCustomerUser } from '~/AuthContext';

interface ChatMessage {
    id?: string; // Thêm ID để chống lặp
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
            const tempId = `temp_${Date.now()}`; // Tạo ID tạm thời
            const chatMessage: ChatMessage = {
                id: tempId,
                content: inputValue,
                senderId: customerId,
                senderName: customerName,
                recipientId: 'ADMIN',
            };
            
            // Cập nhật giao diện ngay lập tức (Optimistic Update)
            setMessages((prev) => [...prev, chatMessage]);

            stompClientRef.current.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify({ ...chatMessage, id: null }), // Gửi lên server không có ID tạm
            });
            setInputValue('');
        }
    };
    
    return (
         <>
            {!isOpen ? (
                <button onClick={() => setIsOpen(true)} className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50 animate-pulse">
                    Chat
                </button>
            ) : (
                <div className="fixed bottom-5 right-5 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col z-50 border">
                    <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
                        <h3 className="font-bold">Hỗ trợ trực tuyến</h3>
                        <button onClick={() => setIsOpen(false)} className="text-xl leading-none">&times;</button>
                    </div>
                    <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
                        {messages.map((msg, index) => (
                            <div key={msg.id || index} className={`mb-3 flex flex-col ${msg.senderId === customerId ? 'items-end' : 'items-start'}`}>
                                <div className={`inline-block p-2 rounded-lg max-w-xs ${msg.senderId === customerId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                    <p className="text-xs font-bold mb-1">{msg.senderName}</p>
                                    <p className="text-sm break-words">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-3 border-t flex">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1 border rounded-l-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nhập tin nhắn..."
                        />
                        <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700">Gửi</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;