import { useEffect, useRef } from 'react'
import ChatPage from './components/ChatPage'
import EditProfile from './components/EditProfile'
import Home from './components/Home'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import Signup from './components/Signup'
import Search from './components/Search'
import ProtectedRoutes from './components/ProtectedRoutes'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000'

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: '/', element: <Home /> },
      { path: 'search', element: <Search /> },
      { path: 'profile/:id', element: <Profile /> },
      { path: 'account/edit', element: <EditProfile /> },
      { path: 'chat', element: <ChatPage /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
])

function App() {
  const userId = useSelector(store => store.auth.user?._id)
  const dispatch = useDispatch()

  const socketRef = useRef(null)
  const connectedUserIdRef = useRef(null)

  useEffect(() => {
    if (!userId) {
      // logout
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        connectedUserIdRef.current = null
      }
      return
    }

    // ✅ chặn reconnect nếu cùng user
    if (connectedUserIdRef.current === userId) return

    // cleanup socket cũ nếu có
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }

    connectedUserIdRef.current = userId

    const socket = io(SOCKET_URL, {
      query: { userId },
      transports: ['websocket'],
    })

    socketRef.current = socket

    socket.on('getOnlineUsers', (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers))
    })

    socket.on('notification', (notification) => {
      dispatch(setLikeNotification(notification))
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      connectedUserIdRef.current = null
    }
  }, [userId, dispatch])

  return <RouterProvider router={browserRouter} />
}

export default App
