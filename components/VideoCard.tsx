"use client";

import Link from "next/link";
import Image from "next/image";

interface VideoCardProps {
    id: string;
    title: string;
    thumbnail: string;
    channelName: string;
    views: string;
    postedAt: string;
    channelAvatar: string;
}

export default function VideoCard({ id, title, thumbnail, channelName, views, postedAt, channelAvatar }: VideoCardProps) {
    return (
        <Link href={`/watch/${id}`} className="flex flex-col gap-3 group">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
                <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
            </div>
            <div className="flex gap-3 items-start">
                <div className="w-9 h-9 relative rounded-full overflow-hidden bg-zinc-700 flex-shrink-0">
                    <Image src={channelAvatar} alt={channelName} fill className="object-cover" />
                </div>
                <div className="flex flex-col">
                    <h3 className="text-white font-bold text-sm sm:text-base line-clamp-2 leading-tight group-hover:text-zinc-200">
                        {title}
                    </h3>
                    <div className="text-zinc-400 text-sm mt-1">
                        <div>{channelName}</div>
                        <div className="flex items-center">
                            <span>{views} views</span>
                            <span className="mx-1">•</span>
                            <span>{postedAt}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
