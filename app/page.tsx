"use client";

import Header from "../components/Header";
import VideoCard from "../components/VideoCard";
import ChatWidget from "../components/ChatWidget";

// Dummy Data
const VIDEOS = [
  {
    id: "jfKfPfyJRdk",
    title: "lofi hip hop radio - beats to relax/study to",
    thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg",
    channelName: "Lofi Girl",
    views: "66K",
    postedAt: "LIVE",
    channelAvatar: "https://yt3.ggpht.com/ytc/AIdro_k2LdCqgJcZfVx9yV-7Z7Z6b4K5g5h5x5x5=s88-c-k-c0x00ffffff-no-rj"
  },
  {
    id: "5qap5aO4i9A",
    title: "lofi hip hop radio - beats to sleep/chill to",
    thumbnail: "https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg",
    channelName: "Lofi Girl",
    views: "24K",
    postedAt: "LIVE",
    channelAvatar: "https://yt3.ggpht.com/ytc/AIdro_k2LdCqgJcZfVx9yV-7Z7Z6b4K5g5h5x5x5=s88-c-k-c0x00ffffff-no-rj"
  },
  {
    id: "LXb3EKWsInQ",
    title: "Jacob Collier - Witness Me (feat. Shawn Mendes, Stormzy & Kirk Franklin) (Official Music Video)",
    thumbnail: "https://i.ytimg.com/vi/LXb3EKWsInQ/hqdefault.jpg",
    channelName: "Jacob Collier",
    views: "2.1M",
    postedAt: "2 weeks ago",
    channelAvatar: "https://yt3.ggpht.com/ytc/AIdro_k2LdCqgJcZfVx9yV-7Z7Z6b4K5g5h5x5x5=s88-c-k-c0x00ffffff-no-rj"
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    channelName: "Rick Astley",
    views: "1.4B",
    postedAt: "14 years ago",
    channelAvatar: "https://yt3.ggpht.com/ytc/AIdro_k2LdCqgJcZfVx9yV-7Z7Z6b4K5g5h5x5x5=s88-c-k-c0x00ffffff-no-rj"
  },
  {
    id: "M7lc1UVf-VE",
    title: "YouTube Developers Live: API",
    thumbnail: "https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg",
    channelName: "Google Developers",
    views: "100K",
    postedAt: "10 years ago",
    channelAvatar: "https://yt3.ggpht.com/ytc/AIdro_k2LdCqgJcZfVx9yV-7Z7Z6b4K5g5h5x5x5=s88-c-k-c0x00ffffff-no-rj"
  },
  {
    id: "t4h3r4e4",
    title: "How to Make the Perfect Espresso",
    thumbnail: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    channelName: "Noir Coffee",
    views: "50K",
    postedAt: "2 days ago",
    channelAvatar: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&q=80"
  },
  {
    id: "c8h1g5j9",
    title: "Late Night Coding Session - ASMR",
    thumbnail: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&q=80",
    channelName: "DevLife",
    views: "120K",
    postedAt: "1 week ago",
    channelAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
  },
  {
    id: "p0o9i8u7",
    title: "Dark Mode UI Design Tutorial",
    thumbnail: "https://images.unsplash.com/photo-1550063194-78494246a220?w=800&q=80",
    channelName: "DesignMaster",
    views: "89K",
    postedAt: "3 weeks ago",
    channelAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80"
  }
];

export default function Home() {
  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white font-sans">
      <Header />

      {/* Sidebar Placeholder (Hidden on mobile) */}
      <aside className="fixed left-0 top-14 bottom-0 w-[72px] hidden md:flex flex-col items-center py-4 gap-6 z-40 bg-[#0f0f0f]">
        {/* Icons for Home, Shorts, Subscriptions, You */}
        {/* Just placeholder divs for layout fidelity */}
      </aside>

      <main className="pt-20 px-4 md:pl-24 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {VIDEOS.map(video => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      </main>

      <ChatWidget />
    </div>
  );
}