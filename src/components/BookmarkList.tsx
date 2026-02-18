"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/utils/supabase"
import { deleteBookmark } from "@/actions/bookmarks"

type Bookmark = {
  id: string
  title: string
  url: string
  user_email: string
}

export default function BookmarkList({ userEmail }: { userEmail: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

  useEffect(() => {
    // 1. Initial Fetch
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

    // 2. Real-time Subscription
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
      <h2>Your Bookmarks</h2>
      {bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        <ul>
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id} style={{ marginBottom: '10px' }}>
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                {bookmark.title}
              </a>
              <button 
                onClick={() => deleteBookmark(bookmark.id)} 
                style={{ marginLeft: '10px', color: 'red', cursor: 'pointer' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
