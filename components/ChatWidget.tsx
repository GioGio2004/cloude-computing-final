"use client";

import { useGSAP } from "@gsap/react";
import { useMutation, useQuery } from "convex/react";
import gsap from "gsap";
import {
    Coffee,
    MessageSquare,
    Plus,
    Send,
    ShoppingBag,
    Trash2,
    X,
    MessageCircle
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

gsap.registerPlugin(useGSAP);

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [chatId, setChatId] = useState<Id<"chats"> | null>(null);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const widgetRef = useRef<HTMLDivElement>(null);

    // Convex Hooks
    const chats = useQuery(api.messages.getChats, {}) || [];
    const messages = useQuery(api.messages.getMessages, chatId ? { chatId } : "skip");
    const createChat = useMutation(api.messages.createChat);
    const sendMessage = useMutation(api.messages.sendMessage);
    const deleteChat = useMutation(api.messages.deleteChat);

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages, isLoading, isOpen]);

    const handleDeleteChat = async (e: React.MouseEvent, id: Id<"chats">) => {
        e.stopPropagation();
        try {
            await deleteChat({ chatId: id });
            if (chatId === id) {
                setChatId(null);
                setInput("");
            }
        } catch (error) {
            console.error("Failed to delete chat:", error);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const tempInput = input;
        setInput("");
        setIsLoading(true);

        try {
            let currentChatId = chatId;
            if (!currentChatId) {
                currentChatId = await createChat({ title: tempInput.slice(0, 30) || "New Conversation" });
                setChatId(currentChatId);
            }

            await sendMessage({
                chatId: currentChatId,
                role: "user",
                content: tempInput,
            });

            const historyPayload = (messages || []).map((m: any) => ({
                role: m.role,
                content: m.content,
                products: m.products
            }));
            historyPayload.push({
                role: "user", content: tempInput,
                products: undefined
            });

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: tempInput,
                    conversationHistory: historyPayload,
                    productContext: "1: Obsidian Espresso ($5), 2: Void Latte ($6), 3: Dark Matter Cake ($8)",
                    chatId: currentChatId
                }),
            });

            if (!response.ok) throw new Error("API failed");

            const data = await response.json();

            await sendMessage({
                chatId: currentChatId,
                role: "assistant",
                content: data.response,
                products: data.productIds
            });

        } catch (error) {
            console.error("Failed to send:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-purple-600 hover:bg-purple-500 rounded-full shadow-lg shadow-purple-500/30 text-white transition-all hover:scale-105"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chat Widget Container */}
            {isOpen && (
                <div
                    ref={widgetRef}
                    className="fixed bottom-24 right-6 z-40 w-[380px] h-[600px] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-white/5 bg-[#050505] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                                <Coffee size={16} className="text-white" />
                            </div>
                            <div>
                                <div className="font-bold text-sm text-white">NOIR_OS</div>
                                <div className="text-[10px] text-green-500 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    ONLINE
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => { setChatId(null); setInput(""); }}
                            className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                            title="New Chat"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    {/* Sidebar / History Toggle (Optional - merging into one view for widget simplicity) */}
                    {/* For a widget, maybe just show history if sidebar is toggled, but let's keep it simple: History list at top if no chat selected? */}
                    {/* Let's stick to the previous logic: if !chatId, show welcome screen. But we need a way to see history in the widget. */}

                    {!chatId ? (
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 font-mono opacity-80">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-2">
                                    <Coffee size={24} className="text-purple-400" />
                                </div>
                                <div className="text-white font-bold tracking-widest">SYSTEM READY</div>
                                <p className="text-xs text-zinc-500">Select a previous session or start a new inquiry.</p>

                                <div className="w-full text-left mt-6">
                                    <div className="text-[10px] uppercase text-zinc-600 font-bold mb-2 tracking-wider">Recent Logs</div>
                                    <div className="space-y-1">
                                        {chats.map((chat: any) => (
                                            <div
                                                key={chat._id}
                                                onClick={() => setChatId(chat._id)}
                                                className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer flex items-center justify-between group transition-colors"
                                            >
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <MessageSquare size={14} className="text-zinc-500" />
                                                    <span className="text-xs text-zinc-300 truncate">{chat.title}</span>
                                                </div>
                                                <button
                                                    onClick={(e) => handleDeleteChat(e, chat._id)}
                                                    className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col min-h-0">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#050505]/50 text-[10px] text-zinc-500">
                                <span className="truncate max-w-[200px]">{chats.find((c: any) => c._id === chatId)?.title || "Session"}</span>
                                <button onClick={() => setChatId(null)} className="hover:text-white">BACK TO LOGS</button>
                            </div>

                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {messages?.map((msg: any) => (
                                    <div key={msg._id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-xl text-xs sm:text-sm ${msg.role === 'user'
                                                ? 'bg-zinc-800 text-white rounded-tr-sm'
                                                : 'bg-purple-900/20 border border-purple-500/20 text-zinc-200 rounded-tl-sm'
                                            }`}>
                                            {msg.content}
                                        </div>
                                        {msg.products && msg.products.length > 0 && (
                                            <div className="mt-2 text-[10px] text-zinc-500 font-mono">
                                                [PRODUCTS: {msg.products.join(', ')}]
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-1 pl-2">
                                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-3 bg-[#050505] border-t border-white/10">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex items-center gap-2 bg-[#121212] rounded-xl p-1 pr-2 border border-white/5 focus-within:border-purple-500/30 transition-colors"
                        >
                            <input
                                className="flex-1 bg-transparent border-none outline-none text-sm text-white px-3 py-2 placeholder-zinc-600"
                                placeholder={chatId ? "Execute command..." : "Start new session..."}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors"
                            >
                                <Send size={14} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
