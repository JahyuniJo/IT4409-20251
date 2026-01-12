import { addIncomingMessage, addMessageRequest } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socketio);
    const { selectedUser } = useSelector(store => store.auth);
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            // Check if the message is from a user we follow
            const isFromFollowedUser = user?.following?.includes(newMessage.senderId);

            if (!isFromFollowedUser && newMessage.senderId !== user?._id) {
                // Message from non-followed user - add to requests
                dispatch(addMessageRequest({
                    senderId: newMessage.senderId,
                    message: newMessage,
                    createdAt: new Date().toISOString()
                }));
            } else {
                // Normal message - add with context of selected user
                dispatch(addIncomingMessage({
                    message: newMessage,
                    senderId: newMessage.senderId,
                    selectedUserId: selectedUser?._id
                }));
            }
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        }
    }, [socket, selectedUser?._id, user?.following, dispatch]);
};

export default useGetRTM;