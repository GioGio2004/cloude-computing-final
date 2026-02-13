"use client";

import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import Header from "../../../components/Header";
import ChatWidget from "../../../components/ChatWidget";
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, User } from "lucide-react";
import Image from "next/image";

export default function WatchPage() {
    const params = useParams();
    const videoId = params.id as string;
    const comments = useQuery(api.comments.list, { videoId }) || [];
    const addComment = useMutation(api.comments.send);

    const [commentInput, setCommentInput] = useState("");

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentInput.trim()) return;

        await addComment({
            videoId,
            content: commentInput,
            author: "User", // Hardcoded for now, or match auth
        });
        setCommentInput("");
    };

    return (
        <div className="bg-[#0f0f0f] min-h-screen text-white font-sans">
            <Header />

            <main className="pt-20 px-4 lg:px-24 flex flex-col lg:flex-row gap-6">
                {/* Main Video Column */}
                <div className="flex-1">
                    {/* Video Player */}
                    <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="border-none"
                        ></iframe>
                    </div>

                    {/* Video Info */}
                    <div className="mt-4">
                        <h1 className="text-xl font-bold line-clamp-2">Video Title Mockup for {videoId}</h1>
                        <div className="flex items-center justify-between mt-3 flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden relative">
                                    <Image src="https://yt3.ggpht.com/a/default-user" alt="Channel" fill className="object-cover" />
                                </div>
                                <div>
                                    <div className="font-bold">Channel Name</div>
                                    <div className="text-xs text-zinc-400">1.2M subscribers</div>
                                </div>
                                <button className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm hover:bg-zinc-200 transition-colors">
                                    Subscribe
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center bg-[#222] rounded-full overflow-hidden">
                                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#333] border-r border-[#333]">
                                        <ThumbsUp size={20} />
                                        <span className="text-sm font-medium">12K</span>
                                    </button>
                                    <button className="px-4 py-2 hover:bg-[#333]">
                                        <ThumbsDown size={20} />
                                    </button>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-[#222] rounded-full hover:bg-[#333] text-sm font-medium">
                                    <Share2 size={20} />
                                    Share
                                </button>
                                <button className="p-2 bg-[#222] rounded-full hover:bg-[#333]">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Description Box */}
                    <div className="mt-4 bg-[#222] rounded-xl p-3 text-sm cursor-pointer hover:bg-[#333] transition-colors">
                        <div className="font-bold mb-1">245K views • 2 weeks ago</div>
                        <p className="text-zinc-200">
                            Here is the description of the video. It contains tags, links, and more info.
                            ...more
                        </p>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-6">
                        <div className="flex items-center gap-8 mb-6">
                            <h2 className="text-xl font-bold">{comments.length} Comments</h2>
                            <div className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                <span>Sort by</span>
                            </div>
                        </div>

                        {/* Add Comment Input */}
                        <div className="flex gap-4 mb-8">
                            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">U</div>
                            <form onSubmit={handleAddComment} className="flex-1">
                                <input
                                    className="w-full bg-transparent border-b border-[#333] focus:border-white outline-none py-1 text-sm text-white placeholder-zinc-500 transition-colors"
                                    placeholder="Add a comment..."
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                />
                                <div className="flex justify-end mt-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCommentInput("")}
                                        className="px-4 py-2 hover:bg-[#333] rounded-full text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!commentInput.trim()}
                                        className="px-4 py-2 bg-[#3ea6ff] text-black rounded-full text-sm font-medium hover:bg-[#65b8ff] disabled:bg-[#222] disabled:text-zinc-500 transition-colors"
                                    >
                                        Comment
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-6">
                            {comments.map((comment: any) => (
                                <div key={comment._id} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-700 shrink-0 flex items-center justify-center text-xs font-bold">
                                        {comment.author[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold">@{comment.author}</span>
                                            <span className="text-xs text-zinc-400">1 minute ago</span>
                                        </div>
                                        <p className="text-sm">{comment.content}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <button className="flex items-center gap-1 text-xs hover:bg-[#333] rounded-full p-1 -ml-1">
                                                <ThumbsUp size={14} />
                                            </button>
                                            <button className="flex items-center gap-1 text-xs hover:bg-[#333] rounded-full p-1">
                                                <ThumbsDown size={14} />
                                            </button>
                                            <button className="text-xs font-medium hover:bg-[#333] rounded-full px-2 py-1">Reply</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Videos Sidebar */}
                <div className="w-full lg:w-[400px] flex-shrink-0">
                    {/* Dummy related videos list */}
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="flex gap-2 group cursor-pointer">
                                <div className="w-[168px] h-[94px] bg-zinc-800 rounded-lg shrink-0 relative overflow-hidden">
                                    {/* Dummy thumbnail */}
                                    <Image src={`https://images.unsplash.com/photo-1611162617${200 + i}-3fdb99097321?w=200&h=113&fit=crop`} alt="" fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold line-clamp-2 leading-tight group-hover:text-zinc-200">Related Video Title {i}</h4>
                                    <div className="text-xs text-zinc-400 mt-1">Channel Name</div>
                                    <div className="text-xs text-zinc-400">100K views • 1 year ago</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <ChatWidget />
        </div>
    );
}
