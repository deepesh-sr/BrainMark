"use client"

import { useState } from "react"
import { addBookmark } from "@/actions/bookmarks"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"

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
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]"
            onClick={() => setFocused(false)}
          />
        )}
      </AnimatePresence>

      <div className="relative z-50 bg-white p-8 rounded-2xl shadow-sm border border-honey-light">
        <h3 className="text-hive font-bold mb-6 border-b-2 border-honey inline-block">Build the Hive</h3>
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col gap-3"
          onFocus={() => setFocused(true)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input 
              placeholder="Bookmark Title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="p-3.5 rounded-lg border border-gray-200 bg-gray-50 text-bee-black outline-none focus:border-honey transition-colors"
            />
            <input 
              placeholder="URL (https://...)" 
              value={url} 
              type="url"
              onChange={(e) => setUrl(e.target.value)} 
              required 
              className="p-3.5 rounded-lg border border-gray-200 bg-gray-50 text-bee-black outline-none focus:border-honey transition-colors"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="p-3.5 rounded-lg bg-honey text-bee-black font-semibold cursor-pointer flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-bee-black rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                  />
                ))}
              </div>
            ) : (
              <><Plus size={20} /> Add to Hive</>
            )}
          </button>
        </form>
      </div>
    </>
  )
}
