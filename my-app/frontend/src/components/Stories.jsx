import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { setStories, markViewed as markViewedAction } from '@/redux/storySlice';
import axios from 'axios';
import CreateStory from './CreateStory';

const API_URL = import.meta.env.VITE_API_URL;

// Story Viewer Component
const StoryViewer = ({ isOpen, onClose, initialUserIndex, storyGroups }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const dispatch = useDispatch();

  const currentUserStories = storyGroups[currentUserIndex];
  const currentStory = currentUserStories?.stories[currentStoryIndex];
  const storyDuration = currentStory?.mediaType === 'video'
    ? (currentStory?.duration || 15) * 1000
    : 5000; // 5 seconds for images

  useEffect(() => {
    setCurrentUserIndex(initialUserIndex);
    setCurrentStoryIndex(0);
    setProgress(0);
  }, [initialUserIndex, isOpen]);

  // Mark story as viewed
  const markViewed = useCallback(async (storyId) => {
    try {
      await axios.post(`${API_URL}/api/v1/story/${storyId}/view`, {}, {
        withCredentials: true
      });
      dispatch(markViewedAction({
        userId: currentUserStories?.userId,
        storyId
      }));
    } catch (error) {
      console.log(error);
    }
  }, [currentUserStories?.userId, dispatch]);

  // Progress timer
  useEffect(() => {
    if (!isOpen || isPaused || !currentStory) return;

    // Mark as viewed
    if (!currentStory.seen) {
      markViewed(currentStory._id);
    }

    // Reset progress for new story
    setProgress(0);

    const interval = 50; // Update every 50ms
    const increment = (interval / storyDuration) * 100;

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          goToNextStory();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOpen, isPaused, currentUserIndex, currentStoryIndex, currentStory, storyDuration, markViewed]);

  // Handle video playback
  useEffect(() => {
    if (currentStory?.mediaType === 'video' && videoRef.current) {
      if (isPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => { });
      }
    }
  }, [isPaused, currentStory]);

  const goToNextStory = () => {
    if (currentStoryIndex < currentUserStories.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else if (currentUserIndex < storyGroups.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(prev => prev - 1);
      const prevUserStories = storyGroups[currentUserIndex - 1];
      setCurrentStoryIndex(prevUserStories.stories.length - 1);
      setProgress(0);
    }
  };

  if (!isOpen || !currentStory) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[450px] h-[90vh] p-0 bg-black border-none overflow-hidden">
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-20">
          {currentUserStories.stories.map((_, index) => (
            <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: index < currentStoryIndex
                    ? '100%'
                    : index === currentStoryIndex
                      ? `${progress}%`
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarImage src={currentUserStories.avatar} />
              <AvatarFallback>{currentUserStories.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-semibold text-sm">{currentUserStories.username}</p>
              <p className="text-white/60 text-xs">
                {new Date(currentStory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsPaused(!isPaused)} className="text-white p-2">
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            {currentStory.mediaType === 'video' && (
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (videoRef.current) {
                    videoRef.current.muted = !isMuted;
                  }
                }}
                className="text-white p-2"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
            <button onClick={onClose} className="text-white p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Story Content */}
        <div
          className="h-full flex items-center justify-center"
          onClick={() => setIsPaused(!isPaused)}
        >
          {currentStory.mediaType === 'video' ? (
            <video
              ref={videoRef}
              src={currentStory.mediaUrl}
              className="w-full h-full object-contain"
              muted={isMuted}
              playsInline
              autoPlay
            />
          ) : (
            <img
              src={currentStory.mediaUrl}
              alt="story"
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Navigation */}
        <button
          onClick={(e) => { e.stopPropagation(); goToPrevStory(); }}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 z-10"
        />
        <button
          onClick={(e) => { e.stopPropagation(); goToNextStory(); }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 z-10"
        />
      </DialogContent>
    </Dialog>
  );
};

// Story Avatar Component
const StoryAvatar = ({ user, onClick, isYourStory = false }) => {
  const hasUnseenStories = user.hasUnseenStories || user.stories?.some(s => !s.seen);

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group"
      style={{ width: '80px' }}
    >
      <div className="relative w-[66px] h-[66px]">
        <div className={`absolute inset-0 rounded-full ${hasUnseenStories
          ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'
          : 'bg-gray-600'
          } p-[2px]`}>
          <div className="w-full h-full rounded-full bg-gray-900 p-[2.5px]">
            <Avatar className="w-full h-full">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-gray-700 text-gray-300">{user.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {isYourStory && (
          <button className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 border-2 border-gray-900 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
            <span className="text-white text-sm font-bold leading-none">+</span>
          </button>
        )}
      </div>

      <span className={`text-xs text-gray-300 w-full truncate text-center group-hover:text-white transition-colors ${isYourStory ? 'font-medium' : ''
        }`}>
        {isYourStory ? 'Your story' : user.username}
      </span>
    </div>
  );
};

const Stories = () => {
  const dispatch = useDispatch();
  const { stories } = useSelector(store => store.story);
  const { user } = useSelector(store => store.auth);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  // Configuration
  const ITEM_WIDTH = 80;
  const GAP = 16;
  const ITEMS_VISIBLE = 6;
  const ITEMS_TO_SCROLL = 4;
  const UNIT_WIDTH = ITEM_WIDTH + GAP;

  // Fetch stories
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/story/feed`, {
          withCredentials: true
        });
        if (res.data.success) {
          dispatch(setStories(res.data.stories));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchStories();
  }, [dispatch]);

  // Add current user placeholder if they have no stories
  const displayStories = [...stories];
  const currentUserHasStories = stories.some(s => s.userId === user?._id);
  if (!currentUserHasStories && user) {
    displayStories.unshift({
      userId: user._id,
      username: user.username,
      avatar: user.profilePicture,
      stories: [],
      hasUnseenStories: false,
      isPlaceholder: true
    });
  }

  const handleNext = () => {
    const maxIndex = displayStories.length - ITEMS_VISIBLE;
    if (startIndex < maxIndex) {
      setStartIndex(Math.min(startIndex + ITEMS_TO_SCROLL, maxIndex));
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(Math.max(startIndex - ITEMS_TO_SCROLL, 0));
    }
  };

  const handleStoryClick = (index) => {
    const storyGroup = displayStories[index];
    if (storyGroup.isPlaceholder || storyGroup.stories.length === 0) {
      setCreateOpen(true);
    } else {
      setSelectedUserIndex(index);
      setViewerOpen(true);
    }
  };

  const handleAddStory = () => {
    setCreateOpen(true);
  };

  return (
    <>
      <div className="relative mb-8 py-4 w-full max-w-[560px] mx-auto group">
        <div className="overflow-hidden w-full">
          <div
            className="flex gap-4 transition-transform duration-500 ease-in-out will-change-transform"
            style={{ transform: `translateX(-${startIndex * UNIT_WIDTH}px)` }}
          >
            {displayStories.map((storyUser, index) => (
              <StoryAvatar
                key={storyUser.userId}
                user={storyUser}
                isYourStory={storyUser.userId === user?._id}
                onClick={() => storyUser.userId === user?._id
                  ? (storyUser.stories?.length > 0 ? handleStoryClick(index) : handleAddStory())
                  : handleStoryClick(index)
                }
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
        {startIndex < (displayStories.length - ITEMS_VISIBLE) && (
          <button
            onClick={handleNext}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-all z-10 border border-gray-200 opacity-0 group-hover:opacity-100"
            aria-label="Next stories"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>

      {/* Story Viewer */}
      <StoryViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        initialUserIndex={selectedUserIndex}
        storyGroups={displayStories.filter(s => s.stories?.length > 0)}
      />

      {/* Create Story Dialog */}
      <CreateStory
        open={createOpen}
        setOpen={setCreateOpen}
        onSuccess={() => {
          // Refetch stories
          axios.get(`${API_URL}/api/v1/story/feed`, { withCredentials: true })
            .then(res => {
              if (res.data.success) {
                dispatch(setStories(res.data.stories));
              }
            });
        }}
      />
    </>
  );
};

export default Stories;