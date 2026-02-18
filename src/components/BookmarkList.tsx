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
    <div className="mt-8">
      <h2 className="text-hive text-xl mb-6 font-bold">
        Stored Nectar
      </h2>
      <Reorder.Group axis="y" values={bookmarks} onReorder={setBookmarks} className="space-y-3 p-0 list-none">
        <AnimatePresence>
          {bookmarks.map((bookmark) => (
            <Reorder.Item 
              key={bookmark.id} 
              value={bookmark}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-honey-light p-4 px-5 rounded-xl flex justify-between items-center cursor-grab shadow-sm"
              whileDrag={{ scale: 1.02, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
            >
              <div className="flex items-center gap-4 flex-1">
                <GripVertical size={20} className="text-gray-300" />
                <div className="flex flex-col">
                  <span className="font-semibold text-bee-black text-base">{bookmark.title}</span>
                  <span className="text-sm text-gray-400 truncate max-w-md">{bookmark.url}</span>
                </div>
              </div>
              
              <div className="flex gap-5 items-center">
                <a 
                  href={bookmark.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gold-dark flex items-center gap-1 no-underline text-sm font-medium hover:text-honey-dark transition-colors"
                >
                  Visit <ExternalLink size={16} />
                </a>
                <button 
                  onClick={() => deleteBookmark(bookmark.id)} 
                  className="bg-transparent border-none text-red-500 cursor-pointer p-1 flex items-center hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
      {bookmarks.length === 0 && (
        <div className="p-12 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
          No nectar stored in this hive yet.
        </div>
      )}
    </div>
  )
}
