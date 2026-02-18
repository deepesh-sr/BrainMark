"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import BookmarkForm from "@/components/BookmarkForm"
import BookmarkList from "@/components/BookmarkList"
import { motion, AnimatePresence } from "framer-motion"
import { Github, LogOut, Plus, List } from "lucide-react"
import { useState } from "react"

export default function Page() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<"add" | "view">("view")

  if (status === "loading") {
    return (
      <div className="h-screen flex justify-center items-center bg-wax">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-honey rounded-full"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    )
  }
 
  return (
    <div className="min-h-screen bg-wax text-bee-black">
      {!session ? (
        <div className="relative h-screen overflow-hidden">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover z-0 opacity-20"
          >
            <source src="https://cdn.pixabay.com/video/2016/09/14/5248-183786781_large.mp4" type="video/mp4" />
          </video>
          
          <div className="relative z-10 flex flex-col justify-center items-center h-screen text-center px-5">
            <h1 className="font-fredericka text-7xl md:text-9xl m-0 text-honey-dark select-none" style={{ textShadow: '4px 4px 0px rgba(255,255,255,0.8)' }}>
              BrainMark
            </h1>
            <p className="max-w-xl text-xl mt-3 mb-12 text-hive/80 font-light tracking-tight">
              A professional digital hive for your discoveries.
            </p>
            <button
              onClick={() => signIn("google")}
              className="px-12 py-5 text-lg cursor-pointer bg-white text-bee-black border border-gray-100 rounded-full font-regular shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all flex items-center gap-4 group"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          <nav className="flex justify-between items-center py-4 px-8 md:px-20 bg-white border-b border-gray-100 sticky top-0 z-100">
            <div className="flex items-center gap-16">
              <h2 style={{ fontFamily: "'Pacifico', cursive" }} className="text-2xl text-honey-dark m-0 select-none">
                BrainMark
              </h2>

              <a 
                href="https://github.com/deepesh-sr/BrainMark" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 text-gray-400 no-underline text-xs font-bold uppercase tracking-widest hover:text-honey transition-colors"
              >
                <Github size={18} /> Source Code
              </a>
            </div>

            <div className="flex items-center gap-8">
              <button 
                onClick={() => signOut()}
                className="bg-gray-50 border border-gray-100 text-gray-600 py-2.5 px-6 rounded-full cursor-pointer text-xs flex items-center gap-2 font-bold uppercase tracking-wider hover:bg-honey hover:text-bee-black hover:border-honey transition-all shadow-sm"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </nav>
          
          <main className="flex-1 py-16 px-8 md:px-20 max-w-4xl mx-auto w-full box-border">
            {/* Tab Slider */}
            <div className="flex bg-white p-1.5 rounded-full border border-gray-100 shadow-sm mb-12 max-w-md mx-auto relative overflow-hidden">
              <motion.div 
                className="absolute top-1.5 bottom-1.5 bg-honey rounded-full z-0"
                initial={false}
                animate={{ 
                  left: activeTab === "add" ? "1.5px" : "50%",
                  right: activeTab === "add" ? "50%" : "1.5px",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
              <button 
                onClick={() => setActiveTab("add")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full text-sm font-bold transition-colors relative z-10 ${activeTab === "add" ? 'text-bee-black' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Plus size={18} /> Add Bookmark
              </button>
              <button 
                onClick={() => setActiveTab("view")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full text-sm font-bold transition-colors relative z-10 ${activeTab === "view" ? 'text-bee-black' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={18} /> View Bookmarks
              </button>
            </div>

            <div className="flex flex-col gap-10">
              <AnimatePresence mode="wait">
                {activeTab === "add" ? (
                  <motion.div
                    key="add"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <BookmarkForm />
                  </motion.div>
                ) : (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <BookmarkList userEmail={session.user?.email || ""} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>

          <footer className="py-8 text-center border-t border-gray-100 bg-white/50">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">
              Built by Deepesh  • <a href="https://deepesh-sr.github.io/golden_retriever/" target="_blank" rel="noopener noreferrer" className="text-honey-dark hover:underline">Visit my portfolio</a>
            </p>
          </footer>
        </div>
      )}
    </div>
  )
}
