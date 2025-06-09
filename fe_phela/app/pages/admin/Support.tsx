import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth, isAdminUser } from '~/AuthContext';
import { getConversations, getChatHistory } from '~/services/chatServices';
import Header from '~/components/admin/Header';

// Interface không đổi
interface ChatMessage {
    id?: string;
    content: string;
    senderId: string;
    recipientId: string;
    senderName: string;
    timestamp: string;
}

interface Conversation {
    customerId: string;
    customerName: string;
    messages: ChatMessage[];
    lastMessage?: string;
}

const Support = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Map<string, Conversation>>(new Map());
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const stompClientRef = useRef<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // useEffect duy nhất để quản lý toàn bộ vòng đời kết nối WebSocket
    useEffect(() => {
        if (user && isAdminUser(user)) {
            // Tải danh sách hội thoại ban đầu
            const loadInitialConversations = async () => {
                try {
                    const convsSummary = await getConversations();
                    setConversations(prev => {
                        const newConvsMap = new Map(prev);
                        for (const conv of convsSummary) {
                            if (!newConvsMap.has(conv.customerId)) {
                                newConvsMap.set(conv.customerId, {
                                    customerId: conv.customerId,
                                    customerName: conv.customerName,
                                    lastMessage: conv.lastMessage,
                                    messages: [],
                                });
                            }
                        }
                        return newConvsMap;
                    });
                } catch (error) {
                    console.error("Failed to load initial conversations", error);
                }
            };
            loadInitialConversations();

            // Tạo và kích hoạt client bên trong effect
            const client = new Client({
                webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
                onConnect: () => {
                    console.log('Admin connected!');
                    client.subscribe('/topic/chat/**', (message) => {
                        const receivedMessage: ChatMessage = JSON.parse(message.body);
                        const customerId = receivedMessage.senderId !== 'ADMIN' ? receivedMessage.senderId : receivedMessage.recipientId;
                        
                        setConversations(prev => {
                            const newConvs = new Map(prev);
                            const conv = newConvs.get(customerId);
                            if (conv) {
                                // Chỉ thêm tin nhắn nếu nó chưa tồn tại
                                if (!conv.messages.some(msg => msg.id === receivedMessage.id)) {
                                    conv.messages.push(receivedMessage);
                                    conv.lastMessage = receivedMessage.content;
                                }
                            } else {
                                newConvs.set(customerId, {
                                    customerId,
                                    customerName: receivedMessage.senderName,
                                    messages: [receivedMessage],
                                    lastMessage: receivedMessage.content,
                                });
                            }
                            return newConvs;
                        });
                    });
                },
                reconnectDelay: 5000,
            });

            client.activate();
            stompClientRef.current = client;

            // Hàm dọn dẹp sẽ ngắt kết nối chính client đã được tạo trong effect này
            return () => {
                client.deactivate();
                stompClientRef.current = null;
                console.log('Admin disconnected!');
            };
        }
    }, [user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversations, selectedCustomerId]);

    const selectConversation = async (customerId: string) => {
        setSelectedCustomerId(customerId);
        const currentConv = conversations.get(customerId);
        if (currentConv && currentConv.messages.length === 0) {
            const history = await getChatHistory(customerId);
            setConversations(prev => {
                const newConvs = new Map(prev);
                const conv = newConvs.get(customerId);
                if(conv) conv.messages = history;
                return newConvs;
            });
        }
    };
    
    const handleSendMessage = () => {
        if (!user || !isAdminUser(user) || !inputValue.trim() || !selectedCustomerId || !stompClientRef.current?.connected) {
            return;
        }

        const chatMessage = {
            content: inputValue,
            senderId: 'ADMIN',
            senderName: user.fullname,
            recipientId: selectedCustomerId,
            timestamp: new Date().toISOString(),
        };

        // Bỏ Optimistic Update, chỉ gửi tin nhắn lên server
        stompClientRef.current.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify(chatMessage),
        });
        setInputValue('');
    };
    
    const selectedConversation = selectedCustomerId ? conversations.get(selectedCustomerId) : null;
    
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden mt-16">
                <aside className="w-1/3 border-r bg-gray-50 overflow-y-auto">
                    <h2 className="p-4 text-lg font-semibold border-b">Các cuộc hội thoại</h2>
                    <ul>
                        {Array.from(conversations.values()).map(conv => (
                            <li key={conv.customerId} onClick={() => selectConversation(conv.customerId)} className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedCustomerId === conv.customerId ? 'bg-blue-100' : ''}`}>
                                <p className="font-bold">{conv.customerName}</p>
                                <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                            </li>
                        ))}
                    </ul>
                </aside>
                <main className="flex-1 flex flex-col">
                    {selectedConversation ? (
                        <>
                            <div className="p-4 border-b">
                                <h2 className="text-xl font-bold">Chat với {selectedConversation.customerName}</h2>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
                                {selectedConversation.messages.map((msg, index) => (
                                    <div key={msg.id || index} className={`mb-3 flex flex-col ${msg.senderId === 'ADMIN' ? 'items-end' : 'items-start'}`}>
                                        <div className={`inline-block p-2 rounded-lg max-w-lg ${msg.senderId === 'ADMIN' ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                                            <p className="text-xs font-bold mb-1">{msg.senderName}</p>
                                            <p className="text-sm break-words">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-4 border-t bg-white flex">
                                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 border rounded-l-md p-2" placeholder={`Trả lời ${selectedConversation.customerName}...`} />
                                <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 rounded-r-md">Gửi</button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            <p>Chọn một cuộc hội thoại để bắt đầu chat.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Support;