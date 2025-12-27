import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

import { setSelectedUser } from '@/redux/authSlice';
import { setMessages } from '@/redux/chatSlice';

const API_URL = import.meta.env.VITE_API_URL;

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState('');
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();
  const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
  const { onlineUsers, messages } = useSelector(store => store.chat);

  /* =========================
     SEND MESSAGE
  ========================== */
  const sendMessageHandler = async (receiverId) => {
    if (!textMessage.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     AUTO OPEN CHAT FROM PROFILE
  ========================== */
  useEffect(() => {
    const receiverId = searchParams.get('userId');
    if (!receiverId || !suggestedUsers.length) return;

    const receiver = suggestedUsers.find(u => u._id === receiverId);
    if (!receiver) return;

    dispatch(setSelectedUser(receiver));

    const initConversation = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/v1/message/all/${receiverId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setMessages(res.data.messages || []));
        }
      } catch (error) {
        console.error(error);
      }
    };

    initConversation();
  }, [searchParams, suggestedUsers, dispatch]);

  /* =========================
     CLEANUP WHEN LEAVE PAGE
  ========================== */
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
      dispatch(setMessages([]));
    };
  }, [dispatch]);

  return (
    <div className="flex h-full w-full bg-[#0F1115] text-white overflow-hidden">

      {/* ===== LEFT SIDEBAR ===== */}
      <section className="w-[340px] flex-shrink-0 border-r border-gray-800 flex flex-col">

        <div className="p-4 border-b border-gray-800">
          <h1 className="font-semibold text-lg">{user?.username}</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser._id);
            const isSelected = selectedUser?._id === suggestedUser._id;

            return (
              <div
                key={suggestedUser._id}
                onClick={async () => {
                  dispatch(setSelectedUser(suggestedUser));

                  try {
                    const res = await axios.get(
                      `${API_URL}/api/v1/message/${suggestedUser._id}`,
                      { withCredentials: true }
                    );

                    if (res.data.success) {
                      dispatch(setMessages(res.data.messages || []));
                    }
                  } catch (error) {
                    console.error(error);
                  }
                }}
                className={`flex gap-3 items-center p-3 cursor-pointer transition ${
                  isSelected ? 'bg-gray-800' : 'hover:bg-gray-800/50'
                }`}
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={suggestedUser.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <span className="font-medium">{suggestedUser.username}</span>
                  <span className={`text-xs ${isOnline ? 'text-green-400' : 'text-gray-500'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== RIGHT CHAT AREA ===== */}
      {selectedUser ? (
        <section className="flex-1 flex flex-col overflow-hidden">

          {/* HEADER */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedUser.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="font-semibold">{selectedUser.username}</span>
              <span className="text-xs text-gray-400">
                {onlineUsers.includes(selectedUser._id) ? 'Active now' : 'Offline'}
              </span>
            </div>
          </div>

          {/* MESSAGES */}
          <Messages selectedUser={selectedUser} />

          {/* INPUT */}
          <div className="flex items-center gap-2 p-4 border-t border-gray-800">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              placeholder="Message..."
              className="flex-1 bg-transparent border-gray-700 text-white focus-visible:ring-0"
            />
            <Button
              disabled={!textMessage.trim()}
              onClick={() => sendMessageHandler(selectedUser._id)}
              className="bg-[#0095F6] hover:bg-[#1877F2]"
            >
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
          <MessageCircleCode className="w-24 h-24 mb-4" />
          <h1 className="font-semibold text-white">Your messages</h1>
          <span className="text-sm">
            Send private photos and messages to a friend.
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
