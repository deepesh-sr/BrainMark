"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/utils/supabase"
import { deleteBookmark } from "@/actions/bookmarks"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { ExternalLink, Trash2, GripVertical } from "lucide-react"

type Bookmark = {
  id: string
  title: string
  url: string
  user_email: string
}

export default function BookmarkList({ userEmail }: { userEmail: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_email", userEmail)
        .order("created_at", { ascending: false })

      if (error) console.error("Error fetching bookmarks:", error)
      else setBookmarks(data || [])
    }

    fetchBookmarks()

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_email=eq.${userEmail}`
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev])
          } else if (payload.eventType === "DELETE") {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userEmail])

  return (
    <div className="mt-8 md:mt-12">
      <h2 className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">
        Stored Bookmark
      </h2>
      <Reorder.Group axis="y" values={bookmarks} onReorder={setBookmarks} className="space-y-3 md:space-y-4 p-0 list-none">
        <AnimatePresence>
          {bookmarks.map((bookmark) => (
            <Reorder.Item 
              key={bookmark.id} 
              value={bookmark}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white border border-gray-100 p-4 md:p-5 rounded-xl flex justify-between items-center cursor-grab shadow-sm md:shadow-none md:hover:shadow-md transition-shadow group relative overflow-hidden"
              whileDrag={{ scale: 1.01, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
                <GripVertical size={18} className="text-gray-200 group-hover:text-honey transition-colors shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-gray-800 text-sm md:text-lg truncate">{bookmark.title}</span>
                  <span className="text-[10px] md:text-xs text-gray-400 font-mono truncate">{new URL(bookmark.url).hostname}</span>
                </div>
              </div>
              
              <div className="flex gap-4 md:gap-6 items-center shrink-0 ml-2">
                <a 
                  href={bookmark.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 flex items-center gap-1 md:gap-1.5 no-underline text-[10px] md:text-sm font-semibold hover:text-honey transition-colors"
                >
                  <span className="hidden xs:inline">Visit</span> <ExternalLink size={14} className="md:w-4 md:h-4" />
                </a>
                <button 
                  onClick={() => deleteBookmark(bookmark.id)} 
                  className="bg-transparent border-none text-gray-200 cursor-pointer p-1 flex items-center hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} className="md:w-5 md:h-5" />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
      {bookmarks.length === 0 && (
        <div className="p-20 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-white/50">
          The hive is currently empty.
        </div>
      )}
    </div>
  )
}
