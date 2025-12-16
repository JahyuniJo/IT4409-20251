#  Frontend-Backend Integration Guide

##  Critical Updates Required

### 1. **Update API Base URLs in Frontend**

Currently your frontend uses: `https://instaclone-g9h5.onrender.com/api/v1/`

**For Development:**
Update all API calls to use: `http://localhost:8000/api/v1/`

**For Production:**
Use your actual deployed backend URL

---

##  Files to Update in Frontend

###  Create API Configuration File

**Create: `frontend/src/config/api.js`**

```javascript
// Development vs Production URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';

export { API_BASE_URL, SOCKET_URL };
```

**Create: `frontend/.env.development`**

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_SOCKET_URL=http://localhost:8000
```

**Create: `frontend/.env.production`**

```env
VITE_API_URL=https://your-backend-domain.com/api/v1
VITE_SOCKET_URL=https://your-backend-domain.com
```

---

###  Update Socket Connection in App.jsx

**Find this line in `App.jsx`:**
```javascript
const socketio = io('http://localhost:8000', {
```

**Replace with:**
```javascript
import { SOCKET_URL } from './config/api';

// In the useEffect:
const socketio = io(SOCKET_URL, {
```

---

###  Update All Component API Calls

Replace all instances of `https://instaclone-g9h5.onrender.com/api/v1/` with `${API_BASE_URL}/`

**Files to update:**

1. **ChatPage.jsx**
   ```javascript
   import { API_BASE_URL } from '@/config/api';
   
   const res = await axios.post(
     `${API_BASE_URL}/message/send/${receiverId}`,
     // ...
   ```

2. **CommentDialog.jsx**
   ```javascript
   import { API_BASE_URL } from '@/config/api';
   
   const res = await axios.post(
     `${API_BASE_URL}/post/${selectedPost?._id}/comment`,
     // ...
   ```

3. **CreatePost.jsx**
   ```javascript
   import { API_BASE_URL } from '@/config/api';
   
   const res = await axios.post(
     `${API_BASE_URL}/post/addpost`,
     // ...
   ```

4. **EditProfile.jsx**
   ```javascript
   import { API_BASE_URL } from '@/config/api';
   
   const res = await axios.post(
     `${API_BASE_URL}/user/profile/edit`,
     // ...
   ```

5. **Login.jsx**
   ```javascript
   import { API_BASE_URL } from '@/config/api';
   
   const res = await axios.post(
     `${API_BASE_URL}/user/login`,
     // ...
   ```

6. **Signup.jsx**
   ```javascript
   import { API_BASE_URL } from '@/config/api';
   
   const res = await axios.post(
     `${API_BASE_URL}/user/register`,
     // ...
   ```

7. **Post.jsx**
   ```javascript
   import { API_BASE_URL } from '@/config/api';
   
   const res = await axios.get(
     `${API_BASE_URL}/post/${post._id}/${action}`,
     // ...
   ```

8. **All Custom Hooks** (`src/hooks/`)
   ```javascript
   import { API_BASE_URL } from '@/config/api';
   
   // useGetAllPost.jsx
   const res = await axios.get(`${API_BASE_URL}/post/all`, ...);
   
   // useGetSuggestedUsers.jsx
   const res = await axios.get(`${API_BASE_URL}/user/suggested`, ...);
   
   // useGetUserProfile.jsx
   const res = await axios.get(`${API_BASE_URL}/user/${userId}/profile`, ...);
   
   // useGetAllMessage.jsx
   const res = await axios.get(`${API_BASE_URL}/message/all/${selectedUser?._id}`, ...);
   ```

---

##  Quick Find & Replace

Use your IDE's find and replace feature:

**Find:**
```
https://instaclone-g9h5.onrender.com/api/v1/
```

**Replace with:**
```
${API_BASE_URL}/
```

Then add the import at the top of each file:
```javascript
import { API_BASE_URL } from '@/config/api';
```

---

##  Verify Axios Configuration

Ensure all axios calls include `withCredentials: true`:

```javascript
const res = await axios.post(
  `${API_BASE_URL}/endpoint`,
  data,
  {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true  //  IMPORTANT!
  }
);
```

This is required for cookies (JWT token) to work properly.

---

##  Testing the Integration

### 1. Start Backend
```bash
cd backend
npm run dev
```

Should show:
```
 MongoDB connected successfully
 Server is running on port 8000
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Flow

1. **Register a new user** → Should work and redirect to login
2. **Login** → Should set cookie and redirect to home
3. **Create a post** → Should upload image and show in feed
4. **Like a post** → Should update like count
5. **Comment on post** → Should add comment
6. **Open chat** → Socket should connect
7. **Edit profile** → Should update profile data

---

##  Debugging Checklist

If something doesn't work:

### Backend Issues:
- [ ] Backend server is running on port 8000
- [ ] MongoDB is connected
- [ ] Cloudinary credentials are correct
- [ ] Check backend console for errors
- [ ] Verify `.env` file exists and has correct values

### Frontend Issues:
- [ ] Frontend is using correct backend URL
- [ ] `withCredentials: true` is set in all axios calls
- [ ] Cookies are enabled in browser
- [ ] Check browser console for errors
- [ ] Check Network tab in DevTools

### CORS Issues:
- [ ] Backend `URL` in `.env` matches frontend URL
- [ ] CORS credentials option is set to `true`
- [ ] Browser allows cross-origin cookies

### Socket.io Issues:
- [ ] Socket URL matches backend URL
- [ ] `userId` is being passed in query params
- [ ] Socket connection shows in browser console
- [ ] Backend logs show socket connection

---

##  Expected API Response Formats

### Login Response:
```json
{
  "message": "Welcome back username",
  "success": true,
  "user": {
    "_id": "...",
    "username": "...",
    "email": "...",
    "profilePicture": "...",
    "bio": "...",
    "gender": "...",
    "followers": [],
    "following": [],
    "posts": []
  }
}
```

### Get All Posts Response:
```json
{
  "posts": [
    {
      "_id": "...",
      "caption": "...",
      "image": "...",
      "author": {
        "_id": "...",
        "username": "...",
        "profilePicture": "..."
      },
      "likes": [],
      "comments": [],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "success": true
}
```

### Send Message Response:
```json
{
  "success": true,
  "newMessage": {
    "_id": "...",
    "senderId": "...",
    "receiverId": "...",
    "message": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

##  Complete Integration Workflow

### Registration Flow:
```
Frontend → POST /api/v1/user/register
         ← 201 Created
         → Navigate to /login
```

### Login Flow:
```
Frontend → POST /api/v1/user/login
         ← 200 OK + Set-Cookie: token
         → Dispatch setAuthUser(user)
         → Navigate to /
```

### Create Post Flow:
```
Frontend → POST /api/v1/post/addpost (FormData)
         ← 201 Created
         → Dispatch setPosts([newPost, ...posts])
         → Close dialog
```

### Like Post Flow:
```
Frontend → GET /api/v1/post/:id/like
         ← 200 OK
         → Update local state
         ← Socket: notification event (if different user)
```

### Send Message Flow:
```
Frontend → POST /api/v1/message/send/:id
         ← 201 Created
         → Update messages state
         ← Socket: newMessage event (to receiver)
```

---

##  Final Checklist

Before considering integration complete:

- [ ] Backend running successfully
- [ ] Frontend running successfully
- [ ] API base URL configured
- [ ] Socket URL configured
- [ ] All axios calls updated
- [ ] `withCredentials: true` in all requests
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can see posts in feed
- [ ] Can create new post
- [ ] Can like/unlike posts
- [ ] Can comment on posts
- [ ] Can edit profile
- [ ] Can send messages
- [ ] Socket.io connects successfully
- [ ] Real-time features work (online users, notifications, messages)

---

##  You're Ready!

Once all checks pass, your full-stack Instagram clone is ready to use! 

**Next steps:**
1. Add more features
2. Improve UI/UX
3. Add tests
4. Deploy to production
5. Share with the world! 
