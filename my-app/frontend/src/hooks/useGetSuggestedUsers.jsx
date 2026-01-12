import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_API_URL;

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        if (!user) return; // ⬅️ CỰC KỲ QUAN TRỌNG

        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/api/v1/user/suggested`,
                    { withCredentials: true }
                );

                if (res.data.success) {
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.error("Fetch suggested users failed:", error);
            }
        };

        fetchSuggestedUsers();
    }, [user, dispatch]);
};

export default useGetSuggestedUsers;
