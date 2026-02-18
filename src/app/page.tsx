"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import BookmarkForm from "@/components/BookmarkForm"
import BookmarkList from "@/components/BookmarkList"
import { motion } from "framer-motion"
import { Github, LogOut } from "lucide-react"

export default function Page() {
  const { data: session, status } = useSession()

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
            <h1 className="font-fredericka text-7xl md:text-8xl m-0 text-honey-dark drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">
              BrainMark
            </h1>
            <p className="max-w-xl text-xl mt-4 mb-10 text-hive font-light">
              A sweet place for your digital discoveries.
            </p>
            <button
              onClick={() => signIn("google")}
              className="px-10 py-4 text-lg cursor-pointer bg-honey text-bee-black border-none rounded-full font-regular shadow-lg shadow-honey/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-honey/40 transition-all active:translate-y-0"
            >
              Signin with Google
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          <nav className="flex justify-between items-center py-4 px-8 md:px-16 bg-white border-b border-honey-light sticky top-0 z-100">
            <div className="flex items-center gap-12">
              <motion.h2
                animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="bg-linear-to-r from-honey-dark via-gold to-honey-dark bg-size-[200%_100%] bg-clip-text text-transparent font-fredericka text-3xl m-0"
              >
                BrainMark
              </motion.h2>

              <a 
                href="https://github.com/deepesh-sr/BrainMark" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 text-bee-dark no-underline text-sm font-medium hover:text-honey transition-colors"
              >
                <Github size={20} /> Source Code
              </a>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-hive">{session.user?.name} 🐝</span>
              <button 
                onClick={() => signOut()}
                className="bg-wax border border-honey text-bee-black py-2 px-5 rounded-full cursor-pointer text-sm flex items-center gap-2 font-semibold hover:bg-honey-light/20 transition-colors"
              >
                <LogOut size={16} /> Fly Out
              </button>
            </div>
          </nav>
          
          <main className="flex-1 py-12 px-8 md:px-16 max-w-6xl mx-auto w-full box-border">
            <div className="flex flex-col gap-8">
              <BookmarkForm />
              <BookmarkList userEmail={session.user?.email || ""} />
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
