import React, { useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className='flex-1 overflow-y-auto px-5 py-4 scrollbar-hide'>
            {/* Profile Header */}
            <div className='flex flex-col items-center justify-center py-8 mb-6'>
                <Avatar className="h-24 w-24 ring-2 ring-offset-4 ring-offset-black ring-gray-700 mb-4">
                    <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                    <AvatarFallback className='bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl'>
                        {selectedUser?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <h3 className='text-white font-semibold text-lg'>{selectedUser?.username}</h3>
                <p className='text-gray-500 text-sm mb-3'>Instagram</p>
                <Link to={`/profile/${selectedUser?._id}`}>
                    <Button
                        variant="secondary"
                        className="h-9 px-4 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold border-0"
                    >
                        View profile
                    </Button>
                </Link>
            </div>

            {/* Messages */}
            <div className='flex flex-col gap-1'>
                {messages && messages.map((msg, index) => {
                    const isSender = msg.senderId === user?._id;
                    const showAvatar = !isSender && (
                        index === 0 ||
                        messages[index - 1]?.senderId === user?._id
                    );
                    const isLastInGroup = (
                        index === messages.length - 1 ||
                        messages[index + 1]?.senderId !== msg.senderId
                    );

                    return (
                        <div
                            key={msg._id}
                            className={`flex items-end gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}
                        >
                            {/* Avatar for received messages */}
                            {!isSender && (
                                <div className='w-7 flex-shrink-0'>
                                    {showAvatar && (
                                        <Avatar className='w-7 h-7'>
                                            <AvatarImage src={selectedUser?.profilePicture} />
                                            <AvatarFallback className='bg-gray-700 text-white text-xs'>
                                                {selectedUser?.username?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            )}

                            {/* Message Bubble */}
                            <div className='group flex items-center gap-2 max-w-[65%]'>
                                {isSender && (
                                    <span className='text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity'>
                                        {formatTime(msg.createdAt)}
                                    </span>
                                )}
                                <div
                                    className={`px-4 py-2.5 break-words ${isSender
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-2xl rounded-br-md'
                                            : 'bg-gray-800 text-white rounded-2xl rounded-bl-md'
                                        } ${isLastInGroup ? '' : isSender ? 'rounded-br-2xl' : 'rounded-bl-2xl'}`}
                                >
                                    <p className='text-sm leading-relaxed'>{msg.message}</p>
                                </div>
                                {!isSender && (
                                    <span className='text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity'>
                                        {formatTime(msg.createdAt)}
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            <style>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    )
}

export default Messages