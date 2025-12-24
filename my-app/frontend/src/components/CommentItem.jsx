import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MoreHorizontal } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_API_URL;

const CommentItem = ({ comment, onReply, onEdit, onDelete }) => {
    const { user } = useSelector(store => store.auth);

    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);

    const [showMenu, setShowMenu] = useState(false);

    const isOwner = user?._id === comment.author?._id;

    /* ===== Reply ===== */
    const handleReply = () => {
        if (!replyText.trim()) return;
        onReply(replyText, comment._id);
        setReplyText("");
        setShowReply(false);
    };

    /* ===== Edit ===== */
    const editCommentHandler = async () => {
        try {
            const res = await axios.put(
                `${API_URL}/api/v1/post/${comment._id}`,
                { text: editText },
                { withCredentials: true }
            );

            if (res.data.success) {
                onEdit(res.data.comment);
                setIsEditing(false);
                setShowMenu(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    /* ===== Delete ===== */
    const deleteCommentHandler = async () => {
        try {
            await axios.delete(
                `${API_URL}/api/v1/post/${comment._id}`,
                { withCredentials: true }
            );
            onDelete(comment._id);
            setShowMenu(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="pl-2 relative">
            <div className="flex gap-3 items-start">
                <Avatar className="h-7 w-7">
                    <AvatarImage src={comment.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    {!isEditing ? (
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white">
                                {comment.author?.username}
                            </span>
                            <span className="text-sm text-zinc-300">
                                {comment.text}
                            </span>
                        </div>
                    ) : (
                        <div className="flex gap-2 mt-1">
                            <input
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                className="flex-1 bg-transparent border-b border-zinc-600 text-sm text-white outline-none"
                            />
                            <button
                                onClick={editCommentHandler}
                                className="text-[#0095f6] text-sm font-semibold"
                            >
                                Save
                            </button>
                        </div>
                    )}

                    <div className="flex gap-4 text-xs text-zinc-500 mt-1">
                        <button onClick={() => setShowReply(p => !p)}>Reply</button>
                    </div>

                    {showReply && (
                        <div className="flex gap-2 mt-2">
                            <input
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                placeholder="Reply..."
                                className="bg-transparent border-b border-zinc-700 text-sm text-white outline-none flex-1"
                            />
                            <button
                                onClick={handleReply}
                                className="text-[#0095f6] text-sm font-semibold"
                            >
                                Post
                            </button>
                        </div>
                    )}
                </div>

                {/* ===== 3 DOT ===== */}
                <div className="relative">
                    <MoreHorizontal
                        size={16}
                        className="text-zinc-400 cursor-pointer hover:text-white"
                        onClick={() => setShowMenu(p => !p)}
                    />

                    {showMenu && (
                        <div className="absolute right-0 top-5 z-50 bg-zinc-900 border border-zinc-700 rounded-md text-sm min-w-[120px]">
                            {isOwner ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setShowMenu(false);
                                        }}
                                        className="block w-full px-3 py-2 text-left hover:bg-zinc-800"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={deleteCommentHandler}
                                        className="block w-full px-3 py-2 text-left text-red-500 hover:bg-zinc-800"
                                    >
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setShowMenu(false)}
                                    className="block w-full px-3 py-2 text-left hover:bg-zinc-800"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ===== Replies (recursive) ===== */}
            {comment.replies?.length > 0 && (
                <div className="pl-8 mt-3 space-y-3">
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            onReply={onReply}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem;
