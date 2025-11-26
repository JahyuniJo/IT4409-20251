import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight, Heart, Send, MoreHorizontal, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ... Keep your MOCK_STORIES constant exactly as it was ...
// For brevity, I am assuming MOCK_STORIES is available here.
const MOCK_STORIES = [
  {
    userId: '1',
    username: 'your_story',
    avatar: 'https://i.pravatar.cc/150?img=50',
    isYourStory: true,
    stories: [{ id: 's1', type: 'image', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=1000&fit=crop', timestamp: new Date(), seen: false }]
  },
  { userId: '2', username: 'john_doe', avatar: 'https://i.pravatar.cc/150?img=12', stories: [{ id: 's2', type: 'image', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1', timestamp: new Date(), seen: false }] },
  { userId: '3', username: 'sarah_travel', avatar: 'https://i.pravatar.cc/150?img=45', stories: [{ id: 's3', type: 'image', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', timestamp: new Date(), seen: false }] },
  { userId: '4', username: 'mike_photos', avatar: 'https://i.pravatar.cc/150?img=33', stories: [{ id: 's4', type: 'image', url: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5', timestamp: new Date(), seen: true }] },
  { userId: '5', username: 'foodie_life', avatar: 'https://i.pravatar.cc/150?img=25', stories: [{ id: 's5', type: 'image', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0', timestamp: new Date(), seen: true }] },
  { userId: '6', username: 'travel_diary', avatar: 'https://i.pravatar.cc/150?img=15', stories: [{ id: 's6', type: 'image', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470', timestamp: new Date(), seen: false }] },
  { userId: '7', username: 'nature_lover', avatar: 'https://i.pravatar.cc/150?img=20', stories: [{ id: 's7', type: 'image', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e', timestamp: new Date(), seen: false }] },
  { userId: '8', username: 'city_lights', avatar: 'https://i.pravatar.cc/150?img=35', stories: [{ id: 's8', type: 'image', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785', timestamp: new Date(), seen: false }] },
  { userId: '9', username: 'tech_guru', avatar: 'https://i.pravatar.cc/150?img=60', stories: [{ id: 's9', type: 'image', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c', timestamp: new Date(), seen: false }] },
  { userId: '10', username: 'art_daily', avatar: 'https://i.pravatar.cc/150?img=68', stories: [{ id: 's10', type: 'image', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f', timestamp: new Date(), seen: false }] }
];

// ... Keep StoryViewer Component exactly as it was ...
const StoryViewer = ({ isOpen, onClose, initialStoryIndex, stories }) => {
  // (Paste your existing StoryViewer code here, omitting for brevity as it hasn't changed)
  const [currentUserIndex, setCurrentUserIndex] = useState(initialStoryIndex);
  // ... (rest of logic)
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 bg-black flex items-center justify-center text-white">Placeholder for StoryViewer</div>;
};


const StoryAvatar = ({ user, onClick }) => {
  const hasUnseenStories = user.stories.some(s => !s.seen);
  
  return (
    <div 
      onClick={onClick}
      // Fixed width per item is critical for smooth sliding math
      className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group"
      style={{ width: '80px' }} // 66px avatar + margins/padding roughly
    >
      <div className={`relative ${user.isYourStory ? 'w-[66px] h-[66px]' : 'w-[66px] h-[66px]'}`}>
        <div className={`absolute inset-0 rounded-full ${
          hasUnseenStories 
            ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' 
            : 'bg-gray-300'
        } p-[2px]`}>
          <div className="w-full h-full rounded-full bg-white p-[2.5px]">
            <Avatar className="w-full h-full">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        {user.isYourStory && (
          <button className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
            <span className="text-white text-sm font-bold leading-none">+</span>
          </button>
        )}
      </div>
      
      <span className={`text-xs text-gray-800 w-full truncate text-center group-hover:text-gray-600 transition-colors ${
        user.isYourStory ? 'font-medium' : ''
      }`}>
        {user.isYourStory ? 'Your story' : user.username}
      </span>
    </div>
  );
};

const Stories = () => {
  const [stories] = useState(MOCK_STORIES);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  
  // SLIDING STATE
  // We track the index of the first visible item
  const [startIndex, setStartIndex] = useState(0);
  
  // CONFIGURATION
  const ITEM_WIDTH = 80; // Width of one story item in px (must match CSS)
  const GAP = 16;        // Gap between items in px
  const ITEMS_VISIBLE = 6;
  const ITEMS_TO_SCROLL = 4;
  
  // Calculate the total width of one "unit" (item + gap)
  const UNIT_WIDTH = ITEM_WIDTH + GAP;

  const handleNext = () => {
    const maxIndex = stories.length - ITEMS_VISIBLE;
    if (startIndex < maxIndex) {
        // Slide 4 items, but don't overshoot the end
        setStartIndex(Math.min(startIndex + ITEMS_TO_SCROLL, maxIndex));
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
        // Slide back 4 items, but don't overshoot the start
        setStartIndex(Math.max(startIndex - ITEMS_TO_SCROLL, 0));
    }
  };

  const handleStoryClick = (index) => {
    setSelectedStoryIndex(index);
    setViewerOpen(true);
  };

  const handleAddStory = () => {
    console.log('Add story clicked');
  };

  return (
    <>
      {/* WRAPPER: Limits width to exactly 6 items */}
      {/* Calculation: (80px * 6) + (16px * 5 gaps) = 480 + 80 = 560px */}
      {/* We add a bit of padding to container to be safe */}
      <div className="relative mb-8 py-4 w-full max-w-[560px] mx-auto group">
        
        {/* VIEWPORT: Hides the overflow */}
        <div className="overflow-hidden w-full">
            
            {/* SLIDING TRACK: Holds all items in a single row */}
            <div 
                className="flex gap-4 transition-transform duration-500 ease-in-out will-change-transform"
                style={{ 
                    // This is the magic that makes it slide
                    transform: `translateX(-${startIndex * UNIT_WIDTH}px)` 
                }}
            >
                {stories.map((user, index) => (
                    <StoryAvatar 
                        key={user.userId} 
                        user={user}
                        onClick={() => user.isYourStory ? handleAddStory() : handleStoryClick(index)}
                    />
                ))}
            </div>
        </div>
        
        {/* Left Arrow */}
        {startIndex > 0 && (
          <button 
            onClick={handlePrev}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-all z-10 border border-gray-200 opacity-0 group-hover:opacity-100"
            aria-label="Previous stories"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Right Arrow */}
        {startIndex < (stories.length - ITEMS_VISIBLE) && (
          <button 
            onClick={handleNext}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-all z-10 border border-gray-200 opacity-0 group-hover:opacity-100"
            aria-label="Next stories"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>

      {/* Pass all stories to viewer since index matches global list now */}
      <StoryViewer 
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        initialStoryIndex={selectedStoryIndex}
        stories={stories} 
      />
    </>
  );
};

export default Stories;