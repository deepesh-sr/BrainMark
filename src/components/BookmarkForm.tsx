"use client"

import { useState } from "react"
import { addBookmark } from "@/actions/bookmarks"
import { motion, AnimatePresence } from "framer-motion"

export default function BookmarkForm() {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [focused, setFocused] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !url) return
    
    setIsSubmitting(true)
    try {
      await addBookmark(title, url)
      setTitle("")
      setUrl("")
    } catch (error) {
      console.error("Failed to add bookmark:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
            onClick={() => setFocused(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 40 }}
          />
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 50, marginBottom: '2rem' }}>
        <form 
          onSubmit={handleSubmit} 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            backgroundColor: '#111',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #fab005'
          }}
          onFocus={() => setFocused(true)}
        >
          <input 
            placeholder="What's the title?" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#000', color: '#fab005', outline: 'none' }}
          />
          <input 
            placeholder="Paste URL (https://...)" 
            value={url} 
            type="url"
            onChange={(e) => setUrl(e.target.value)} 
            required 
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#000', color: '#fab005', outline: 'none' }}
          />
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ 
              padding: '12px', 
              borderRadius: '6px', 
              border: 'none', 
              backgroundColor: '#fab005', 
              color: '#000', 
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {isSubmitting ? (
              <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    style={{ width: '6px', height: '6px', backgroundColor: '#000', borderRadius: '50%' }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                  />
                ))}
              </div>
            ) : "Save Bookmark"}
          </button>
        </form>
      </div>
    </>
  )
}
