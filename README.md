# 🎨 Real-Time Collaborative Whiteboard

A full-stack, real-time whiteboard application that allows multiple users to draw, sketch. Built with React, Node.js, and Socket.io.

**[View Live Demo](https://collaborative-whiteboard-swart.vercel.app)** *(Note: The backend is hosted on Render's free tier, so it may take ~30-60 seconds to wake up on the initial load.)*

![Project Screenshot](https://via.placeholder.com/800x450?text=Screenshot+of+Collaborative+Whiteboard)

## ✨ Key Features

* **Real-Time Sync:** Drawing events are broadcast instantly to all connected clients using WebSockets.
* **Customizable Tools:**
    * **Color Picker:** Choose any hex color for your brush.
    * **Dynamic Line Width:** Adjustable slider (1px - 50px) for precision or markers.
* **Global Actions:** "Clear Board" functionality that wipes the canvas for all users simultaneously.
* **Responsive Canvas:** Intelligent handling of window resizing without losing drawing history or context state.
* **Performance Optimized:** Uses HTML5 Canvas API with `requestAnimationFrame` handling via React Refs for 60fps performance.

## 🛠️ Tech Stack

### Frontend
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Graphics:** HTML5 Canvas API
* **State Management:** React Hooks (`useRef`, `useState`, `useEffect`)

### Backend
* **Runtime:** Node.js
* **Server:** Express.js
* **Real-Time Engine:** Socket.io
* **Deployment:** Render (Backend) + Vercel (Frontend)

## 🚀 Getting Started Locally

Follow these steps to run the project on your local machine.

### Prerequisites
* Node.js (v16 or higher)
* npm

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/collaborative-whiteboard.git](https://github.com/YOUR_USERNAME/collaborative-whiteboard.git)
cd collaborative-whiteboard

cd server
npm install

# Create a .env file (optional for local, defaults to port 3001)
# echo "PORT=3001" > .env

# Start the server
npm run dev

cd client
npm install

# Create env file for Vite
echo "VITE_SERVER_URL=http://localhost:3001" > .env

# Start the React app
npm run dev

The app should now be running on http://localhost:5173

🧠 Technical Highlights & Challenges
Concurrency & State Management
One of the biggest challenges was handling the React render cycle against the imperative nature of the HTML Canvas API. I utilized useRef to maintain the WebSocket connection and Canvas Context without triggering unnecessary re-renders, ensuring the drawing experience remains buttery smooth.

The "Resize" Problem
HTML5 Canvas wipes its data when dimensions change. I implemented a resize handler that:

Snapshots the current pixel data (getImageData).

Resizes the canvas element.

Restores the pixel data (putImageData).

Re-applies the user's current brush settings (Color/Width) to the new context.

🔮 Future Improvements
Room Support: Allow users to generate unique room codes for private sessions.

Persistence: Save drawing history to Redis/MongoDB so new users see what was drawn before they joined.

Undo/Redo Stack: Implement a history stack to allow users to undo their last stroke.
