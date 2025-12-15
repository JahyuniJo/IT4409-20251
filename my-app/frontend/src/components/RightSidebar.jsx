// import React, { useState } from 'react';
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { MessageCircle, X, Send, Search, MoreHorizontal, Phone, Video, Info, Smile } from 'lucide-react';

// const SUGGESTED_USERS = [
//   { id: 1, username: 'alex_photos', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/40?img=1', followedBy: 'john_doe' },
//   { id: 2, username: 'travel_diary', name: 'Sarah Lee', avatar: 'https://i.pravatar.cc/40?img=2', followedBy: 'jane_smith' },
//   { id: 3, username: 'food_lover', name: 'Mike Chen', avatar: 'https://i.pravatar.cc/40?img=3', followedBy: 'foodie_life' },
//   { id: 4, username: 'fitness_pro', name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/40?img=4', followedBy: 'gym_buddy' },
//   { id: 5, username: 'art_studio', name: 'David Brown', avatar: 'https://i.pravatar.cc/40?img=6', followedBy: 'creative_mind' },
// ];

// const MOCK_CONVERSATIONS = [
//   { 
//     id: 1, 
//     username: 'john_doe', 
//     name: 'John Doe', 
//     avatar: 'https://i.pravatar.cc/40?img=12',
//     lastMessage: 'Hey! How are you doing?',
//     timestamp: '2h ago',
//     unread: 2,
//     online: true
//   },
//   { 
//     id: 2, 
//     username: 'sarah_travel', 
//     name: 'Sarah Travel', 
//     avatar: 'https://i.pravatar.cc/40?img=45',
//     lastMessage: 'Thanks for sharing!',
//     timestamp: '5h ago',
//     unread: 0,
//     online: true
//   },
//   { 
//     id: 3, 
//     username: 'mike_wilson', 
//     name: 'Mike Wilson', 
//     avatar: 'https://i.pravatar.cc/40?img=33',
//     lastMessage: 'See you tomorrow 👋',
//     timestamp: '1d ago',
//     unread: 0,
//     online: false
//   },
// ];

// const MessagesBubble = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [message, setMessage] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       console.log('Message sent:', message);
//       setMessage('');
//     }
//   };

//   const filteredConversations = MOCK_CONVERSATIONS.filter(conv =>
//     conv.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     conv.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const unreadCount = MOCK_CONVERSATIONS.reduce((acc, conv) => acc + conv.unread, 0);

//   return (
//     <div className="fixed bottom-0 right-8 z-50">
//       {/* Chat Window */}
//       {isOpen && !selectedChat && (
//         <div className="mb-4 w-[360px] h-[480px] bg-white rounded-t-2xl shadow-2xl border border-gray-200 flex flex-col">
//           {/* Header */}
//           <div className="flex items-center justify-between p-4 border-b">
//             <div>
//               <h3 className="font-semibold text-base">Messages</h3>
//               <p className="text-xs text-gray-500">{MOCK_CONVERSATIONS.length} conversations</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <button className="hover:bg-gray-100 p-2 rounded-full transition-colors">
//                 <MoreHorizontal className="w-5 h-5" />
//               </button>
//               <button 
//                 onClick={() => setIsOpen(false)}
//                 className="hover:bg-gray-100 p-2 rounded-full transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           {/* Search */}
//           <div className="p-3 border-b">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <Input
//                 type="text"
//                 placeholder="Search messages..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 h-9 bg-gray-100 border-none focus-visible:ring-1"
//               />
//             </div>
//           </div>

//           {/* Conversations List */}
//           <div className="flex-1 overflow-y-auto">
//             {filteredConversations.map((conv) => (
//               <div
//                 key={conv.id}
//                 onClick={() => setSelectedChat(conv)}
//                 className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
//               >
//                 <div className="relative">
//                   <Avatar className="w-12 h-12">
//                     <AvatarImage src={conv.avatar} />
//                     <AvatarFallback>{conv.username[0].toUpperCase()}</AvatarFallback>
//                   </Avatar>
//                   {conv.online && (
//                     <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
//                   )}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between">
//                     <p className="font-semibold text-sm truncate">{conv.username}</p>
//                     <span className="text-xs text-gray-500">{conv.timestamp}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <p className={`text-sm truncate ${conv.unread > 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
//                       {conv.lastMessage}
//                     </p>
//                     {conv.unread > 0 && (
//                       <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
//                         {conv.unread}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Individual Chat Window */}
//       {isOpen && selectedChat && (
//         <div className="mb-4 w-[360px] h-[480px] bg-white rounded-t-2xl shadow-2xl border border-gray-200 flex flex-col">
//           {/* Chat Header */}
//           <div className="flex items-center justify-between p-3 border-b">
//             <div className="flex items-center gap-3 flex-1 min-w-0">
//               <button
//                 onClick={() => setSelectedChat(null)}
//                 className="hover:bg-gray-100 p-1 rounded-full transition-colors"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//               <Avatar className="w-8 h-8">
//                 <AvatarImage src={selectedChat.avatar} />
//                 <AvatarFallback>{selectedChat.username[0].toUpperCase()}</AvatarFallback>
//               </Avatar>
//               <div className="flex-1 min-w-0">
//                 <p className="font-semibold text-sm truncate">{selectedChat.username}</p>
//                 <p className="text-xs text-gray-500">{selectedChat.online ? 'Active now' : 'Offline'}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-1">
//               <button className="hover:bg-gray-100 p-2 rounded-full transition-colors">
//                 <Phone className="w-4 h-4" />
//               </button>
//               <button className="hover:bg-gray-100 p-2 rounded-full transition-colors">
//                 <Video className="w-4 h-4" />
//               </button>
//               <button className="hover:bg-gray-100 p-2 rounded-full transition-colors">
//                 <Info className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           {/* Messages Area */}
//           <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//             <div className="flex flex-col gap-3">
//               <div className="flex gap-2">
//                 <Avatar className="w-7 h-7 flex-shrink-0">
//                   <AvatarImage src={selectedChat.avatar} />
//                   <AvatarFallback>{selectedChat.username[0].toUpperCase()}</AvatarFallback>
//                 </Avatar>
//                 <div className="bg-gray-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[70%]">
//                   <p className="text-sm">Hey! How are you doing?</p>
//                 </div>
//               </div>
//               <div className="flex gap-2 justify-end">
//                 <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[70%]">
//                   <p className="text-sm">I'm great! Just working on some projects 😊</p>
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <Avatar className="w-7 h-7 flex-shrink-0">
//                   <AvatarImage src={selectedChat.avatar} />
//                   <AvatarFallback>{selectedChat.username[0].toUpperCase()}</AvatarFallback>
//                 </Avatar>
//                 <div className="bg-gray-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[70%]">
//                   <p className="text-sm">That's awesome! Want to catch up later?</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Message Input */}
//           <div className="p-3 border-t bg-white">
//             <div className="flex items-center gap-2">
//               <button className="hover:bg-gray-100 p-2 rounded-full transition-colors">
//                 <Smile className="w-5 h-5 text-gray-600" />
//               </button>
//               <Input
//                 type="text"
//                 placeholder="Message..."
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//                 className="flex-1 border-none bg-gray-100 focus-visible:ring-0"
//               />
//               {message.trim() && (
//                 <button 
//                   onClick={handleSendMessage}
//                   className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
//                 >
//                   <Send className="w-5 h-5" />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Floating Rectangle Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="bg-white hover:bg-gray-50 rounded-2xl px-4 py-3 shadow-lg border border-gray-200 transition-all hover:shadow-xl relative min-w-[200px]"
//       >
//         <div className="flex items-center gap-3">
//           {/* Message Icon */}
//           <div className="relative">
//             <Send className="w-5 h-5" />
//             {unreadCount > 0 && (
//               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
//                 {unreadCount}
//               </span>
//             )}
//           </div>
          
//           {/* Title */}
//           <span className="font-semibold text-sm">Tin nhắn</span>
          
//           {/* Mini Avatars */}
//           <div className="flex -space-x-2 ml-auto">
//             {MOCK_CONVERSATIONS.slice(0, 3).map((conv, index) => (
//               <Avatar 
//                 key={conv.id} 
//                 className="w-7 h-7 border-2 border-white"
//                 style={{ zIndex: 3 - index }}
//               >
//                 <AvatarImage src={conv.avatar} />
//                 <AvatarFallback>{conv.username[0].toUpperCase()}</AvatarFallback>
//               </Avatar>
//             ))}
//           </div>
//         </div>
//       </button>
//     </div>
//   );
// };

// const RightSidebar = () => {
//   const [followingUsers, setFollowingUsers] = useState([]);
  
//   const currentUser = {
//     username: 'demo_user',
//     name: 'Demo User',
//     avatar: 'https://i.pravatar.cc/40'
//   };

//   const handleFollow = (userId) => {
//     if (followingUsers.includes(userId)) {
//       setFollowingUsers(followingUsers.filter(id => id !== userId));
//     } else {
//       setFollowingUsers([...followingUsers, userId]);
//     }
//   };

//   return (
//     <>
//       <div className='w-[350px] my-10 pr-8 hidden lg:block'>
//         {/* Current User Profile */}
//         <div className='flex items-center gap-3 mb-8'>
//           <Avatar className='w-14 h-14 cursor-pointer hover:opacity-90 transition-opacity'>
//             <AvatarImage src={currentUser.avatar} />
//             <AvatarFallback>{currentUser.username[0].toUpperCase()}</AvatarFallback>
//           </Avatar>
//           <div className='flex-1 min-w-0'>
//             <p className='font-semibold text-sm cursor-pointer hover:text-gray-600 transition-colors truncate'>
//               {currentUser.username}
//             </p>
//             <p className='text-gray-500 text-sm truncate'>{currentUser.name}</p>
//           </div>
//           <Button variant="ghost" className='text-blue-500 font-semibold text-sm hover:text-blue-600 hover:bg-transparent'>
//             Switch
//           </Button>
//         </div>

//         {/* Suggestions Section */}
//         <div>
//           <div className='flex items-center justify-between mb-4'>
//             <p className='font-semibold text-gray-500 text-sm'>Suggestions For You</p>
//             <Button variant="ghost" className='text-xs font-semibold hover:text-gray-600 p-0 h-auto hover:bg-transparent'>
//               See All
//             </Button>
//           </div>

//           {/* Suggested Users List */}
//           <div className='space-y-4'>
//             {SUGGESTED_USERS.map((user) => (
//               <div key={user.id} className='flex items-center gap-3'>
//                 <Avatar className='w-11 h-11 cursor-pointer hover:opacity-90 transition-opacity'>
//                   <AvatarImage src={user.avatar} />
//                   <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
//                 </Avatar>
//                 <div className='flex-1 min-w-0'>
//                   <p className='font-semibold text-sm cursor-pointer hover:text-gray-600 transition-colors truncate'>
//                     {user.username}
//                   </p>
//                   <p className='text-gray-500 text-xs truncate'>
//                     Followed by {user.followedBy}
//                   </p>
//                 </div>
//                 <Button 
//                   variant="ghost"
//                   onClick={() => handleFollow(user.id)}
//                   className={`font-semibold text-xs p-0 h-auto hover:bg-transparent transition-colors ${
//                     followingUsers.includes(user.id) 
//                       ? 'text-gray-700 hover:text-gray-900' 
//                       : 'text-blue-500 hover:text-blue-600'
//                   }`}
//                 >
//                   {followingUsers.includes(user.id) ? 'Following' : 'Follow'}
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Footer Links */}
//         <div className='mt-8 text-xs text-gray-400 space-y-2'>
//           <div className='flex flex-wrap gap-x-2 gap-y-1'>
//             <a href='#' className='hover:underline transition-all'>About</a>
//             <span>·</span>
//             <a href='#' className='hover:underline transition-all'>Help</a>
//             <span>·</span>
//             <a href='#' className='hover:underline transition-all'>Press</a>
//             <span>·</span>
//             <a href='#' className='hover:underline transition-all'>API</a>
//             <span>·</span>
//             <a href='#' className='hover:underline transition-all'>Jobs</a>
//             <span>·</span>
//             <a href='#' className='hover:underline transition-all'>Privacy</a>
//             <span>·</span>
//             <a href='#' className='hover:underline transition-all'>Terms</a>
//           </div>
//           <p className='text-gray-400 uppercase text-[11px] font-semibold'>
//             © 2024 INSTAGRAM FROM META
//           </p>
//         </div>
//       </div>

//       {/* Floating Messages Bubble - Always visible */}
//       <MessagesBubble />
//     </>
//   );
// };

// export default RightSidebar;

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageCircle, X, Send, Search, MoreHorizontal, Phone, Video, Info, Smile } from 'lucide-react';

const SUGGESTED_USERS = [
  { id: 1, username: 'alex_photos', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/40?img=1', followedBy: 'john_doe' },
  { id: 2, username: 'travel_diary', name: 'Sarah Lee', avatar: 'https://i.pravatar.cc/40?img=2', followedBy: 'jane_smith' },
  { id: 3, username: 'food_lover', name: 'Mike Chen', avatar: 'https://i.pravatar.cc/40?img=3', followedBy: 'foodie_life' },
  { id: 4, username: 'fitness_pro', name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/40?img=4', followedBy: 'gym_buddy' },
  { id: 5, username: 'art_studio', name: 'David Brown', avatar: 'https://i.pravatar.cc/40?img=6', followedBy: 'creative_mind' },
];

const MOCK_CONVERSATIONS = [
  { 
    id: 1, 
    username: 'john_doe', 
    name: 'John Doe', 
    avatar: 'https://i.pravatar.cc/40?img=12',
    lastMessage: 'Hey! How are you doing?',
    timestamp: '2h ago',
    unread: 2,
    online: true
  },
  { 
    id: 2, 
    username: 'sarah_travel', 
    name: 'Sarah Travel', 
    avatar: 'https://i.pravatar.cc/40?img=45',
    lastMessage: 'Thanks for sharing!',
    timestamp: '5h ago',
    unread: 0,
    online: true
  },
  { 
    id: 3, 
    username: 'mike_wilson', 
    name: 'Mike Wilson', 
    avatar: 'https://i.pravatar.cc/40?img=33',
    lastMessage: 'See you tomorrow 👋',
    timestamp: '1d ago',
    unread: 0,
    online: false
  },
];

const MessagesBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  const filteredConversations = MOCK_CONVERSATIONS.filter(conv =>
    conv.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = MOCK_CONVERSATIONS.reduce((acc, conv) => acc + conv.unread, 0);

  return (
    <div className="fixed bottom-6 right-8 z-50">
      {/* Chat Window */}
      {isOpen && !selectedChat && (
        <div className="mb-4 w-[360px] h-[480px] bg-[#38393E] rounded-2xl shadow-2xl border border-gray-700 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-600">
            <div>
              <h3 className="font-semibold text-base text-white">Messages</h3>
              <p className="text-xs text-gray-400">{MOCK_CONVERSATIONS.length} conversations</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="hover:bg-gray-700 p-2 rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-gray-700 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-gray-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 bg-gray-700 border-none focus-visible:ring-1 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedChat(conv)}
                className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conv.avatar} />
                    <AvatarFallback>{conv.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#38393E] rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm truncate text-white">{conv.username}</p>
                    <span className="text-xs text-gray-400">{conv.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${conv.unread > 0 ? 'font-medium text-white' : 'text-gray-400'}`}>
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                      <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Individual Chat Window */}
      {isOpen && selectedChat && (
        <div className="mb-4 w-[360px] h-[480px] bg-[#38393E] rounded-2xl shadow-2xl border border-gray-700 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-600">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => setSelectedChat(null)}
                className="hover:bg-gray-700 p-1 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedChat.avatar} />
                <AvatarFallback>{selectedChat.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-white">{selectedChat.username}</p>
                <p className="text-xs text-gray-400">{selectedChat.online ? 'Active now' : 'Offline'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="hover:bg-gray-700 p-2 rounded-full transition-colors">
                <Phone className="w-4 h-4 text-white" />
              </button>
              <button className="hover:bg-gray-700 p-2 rounded-full transition-colors">
                <Video className="w-4 h-4 text-white" />
              </button>
              <button className="hover:bg-gray-700 p-2 rounded-full transition-colors">
                <Info className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#2a2b2f]">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Avatar className="w-7 h-7 flex-shrink-0">
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback>{selectedChat.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="bg-gray-700 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[70%]">
                  <p className="text-sm text-white">Hey! How are you doing?</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[70%]">
                  <p className="text-sm">I'm great! Just working on some projects 😊</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Avatar className="w-7 h-7 flex-shrink-0">
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback>{selectedChat.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="bg-gray-700 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[70%]">
                  <p className="text-sm text-white">That's awesome! Want to catch up later?</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-3 border-t border-gray-600 bg-[#38393E]">
            <div className="flex items-center gap-2">
              <button className="hover:bg-gray-700 p-2 rounded-full transition-colors">
                <Smile className="w-5 h-5 text-gray-400" />
              </button>
              <Input
                type="text"
                placeholder="Message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border-none bg-gray-700 focus-visible:ring-0 text-white placeholder:text-gray-400"
              />
              {message.trim() && (
                <button 
                  onClick={handleSendMessage}
                  className="text-blue-500 font-semibold hover:text-blue-400 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Rectangle Button - Only show when chat is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#38393E] hover:bg-[#2a2b2f] rounded-2xl px-4 py-3 shadow-lg border border-gray-700 transition-all hover:shadow-xl relative min-w-[200px]"
        >
          <div className="flex items-center gap-3">
            {/* Message Icon */}
            <div className="relative">
              <Send className="w-5 h-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                  {unreadCount}
                </span>
              )}
            </div>
            
            {/* Title */}
            <span className="font-semibold text-sm text-white">Tin nhắn</span>
            
            {/* Mini Avatars */}
            <div className="flex -space-x-2 ml-auto">
              {MOCK_CONVERSATIONS.slice(0, 3).map((conv, index) => (
                <Avatar 
                  key={conv.id} 
                  className="w-7 h-7 border-2 border-[#38393E]"
                  style={{ zIndex: 3 - index }}
                >
                  <AvatarImage src={conv.avatar} />
                  <AvatarFallback>{conv.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </button>
      )}
    </div>
  );
};

const RightSidebar = () => {
  const [followingUsers, setFollowingUsers] = useState([]);
  
  const currentUser = {
    username: 'demo_user',
    name: 'Demo User',
    avatar: 'https://i.pravatar.cc/40'
  };

  const handleFollow = (userId) => {
    if (followingUsers.includes(userId)) {
      setFollowingUsers(followingUsers.filter(id => id !== userId));
    } else {
      setFollowingUsers([...followingUsers, userId]);
    }
  };

  return (
    <>
      <div className='w-[350px] my-10 pr-8 hidden lg:block'>
        {/* Current User Profile */}
        <div className='flex items-center gap-3 mb-8'>
          <Avatar className='w-14 h-14 cursor-pointer hover:opacity-90 transition-opacity'>
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>{currentUser.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='flex-1 min-w-0'>
            <p className='font-semibold text-sm cursor-pointer hover:text-gray-600 transition-colors truncate'>
              {currentUser.username}
            </p>
            <p className='text-gray-500 text-sm truncate'>{currentUser.name}</p>
          </div>
          <Button variant="ghost" className='text-blue-500 font-semibold text-sm hover:text-blue-600 hover:bg-transparent'>
            Đăng xuất
          </Button>
        </div>

        {/* Suggestions Section */}
        <div>
          <div className='flex items-center justify-between mb-4'>
            <p className='font-semibold text-gray-500 text-sm'>Suggestions For You</p>
            <Button variant="ghost" className='text-xs font-semibold hover:text-gray-600 p-0 h-auto hover:bg-transparent'>
              See All
            </Button>
          </div>

          {/* Suggested Users List */}
          <div className='space-y-4'>
            {SUGGESTED_USERS.map((user) => (
              <div key={user.id} className='flex items-center gap-3'>
                <Avatar className='w-11 h-11 cursor-pointer hover:opacity-90 transition-opacity'>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className='flex-1 min-w-0'>
                  <p className='font-semibold text-sm cursor-pointer hover:text-gray-600 transition-colors truncate'>
                    {user.username}
                  </p>
                  <p className='text-gray-500 text-xs truncate'>
                    Followed by {user.followedBy}
                  </p>
                </div>
                <Button 
                  variant="ghost"
                  onClick={() => handleFollow(user.id)}
                  className={`font-semibold text-xs p-0 h-auto hover:bg-transparent transition-colors ${
                    followingUsers.includes(user.id) 
                      ? 'text-gray-700 hover:text-gray-900' 
                      : 'text-blue-500 hover:text-blue-600'
                  }`}
                >
                  {followingUsers.includes(user.id) ? 'Following' : 'Follow'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Messages Bubble - Always visible */}
      <MessagesBubble />
    </>
  );
};

export default RightSidebar;