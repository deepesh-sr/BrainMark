"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/utils/supabase"
import { deleteBookmark } from "@/actions/bookmarks"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { ExternalLink, Trash2 } from "lucide-react"

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
    <div>
      <h2 style={{ color: '#fab005', fontSize: '1.2rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Stored Nectar
      </h2>
      <Reorder.Group axis="y" values={bookmarks} onReorder={setBookmarks} style={{ listStyle: 'none', padding: 0 }}>
        <AnimatePresence>
          {bookmarks.map((bookmark) => (
            <Reorder.Item 
              key={bookmark.id} 
              value={bookmark}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ 
                backgroundColor: '#111', 
                border: '1px solid #333',
                padding: '12px 16px', 
                borderRadius: '12px',
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'grab'
              }}
              whileDrag={{ scale: 1.05, boxShadow: '0 10px 20px rgba(250, 176, 5, 0.2)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: 500, color: '#fab005' }}>{bookmark.title}</span>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>{new URL(bookmark.url).hostname}</span>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <a 
                  href={bookmark.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: '#fab005' }}
                >
                  <ExternalLink size={18} />
                </a>
                <button 
                  onClick={() => deleteBookmark(bookmark.id)} 
                  style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: 0 }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
      {bookmarks.length === 0 && (
        <p style={{ color: '#444', textAlign: 'center', marginTop: '2rem' }}>Empty Hive... add some links!</p>
      )}
    </div>
  )
}
