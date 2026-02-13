"use client";

import { Bell, Menu, Mic, Search, Video, User } from "lucide-react";
import { Coffee } from "lucide-react";
import Link from "next/link";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 h-14 bg-[#0f0f0f] flex items-center justify-between px-4 z-50">
            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-white/10 rounded-full text-white">
                    <Menu size={24} />
                </button>
                <Link href="/" className="flex items-center gap-1 text-white font-bold tracking-tighter text-xl">
                    <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                        <Coffee size={16} className="text-white fill-white" />
                    </div>
                    <span>NoirTube</span>
                </Link>
            </div>

            <div className="hidden md:flex items-center flex-1 max-w-[720px] mx-4">
                <div className="flex flex-1 items-center">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-[#121212] border border-[#303030] text-white px-4 py-2 rounded-l-full focus:border-blue-500 focus:outline-none placeholder-zinc-500"
                    />
                    <button className="bg-[#222222] border border-l-0 border-[#303030] px-5 py-2 rounded-r-full hover:bg-[#303030] transition-colors">
                        <Search size={20} className="text-white" />
                    </button>
                </div>
                <button className="ml-4 p-2 bg-[#181818] hover:bg-[#303030] rounded-full text-white transition-colors">
                    <Mic size={20} />
                </button>
            </div>

            <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/10 rounded-full text-white hidden sm:block">
                    <Video size={24} />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full text-white hidden sm:block">
                    <Bell size={24} />
                </button>
                <div className="w-8 h-8 bg-purple-600 rounded-full ml-2 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
                    N
                </div>
            </div>
        </header>
    );
}
