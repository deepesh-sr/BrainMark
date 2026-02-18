"use client"

import { useState } from "react"
import { addBookmark } from "@/actions/bookmarks"

export default function BookmarkForm() {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !url) return
    
    try {
      await addBookmark(title, url)
      setTitle("")
      setUrl("")
    } catch (error) {
      console.error("Failed to add bookmark:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <input 
        placeholder="Bookmark Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        required 
      />
      <input 
        placeholder="Bookmark URL (https://...)" 
        value={url} 
        type="url"
        onChange={(e) => setUrl(e.target.value)} 
        required 
      />
      <button type="submit">Add Bookmark</button>
    </form>
  )
}
