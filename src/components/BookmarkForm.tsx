"use client"

import { useState, useEffect } from "react"
import { addBookmark } from "@/actions/bookmarks"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"

export default function BookmarkForm() {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [focused, setFocused] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

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
            className="fixed inset-0 bg-black/10 z-40 backdrop-blur-[1px]"
            onClick={() => setFocused(false)}
          />
        )}
      </AnimatePresence>

      <motion.div 
        className="relative z-50 bg-white p-8 rounded-xl border border-gray-100 shadow-sm"
      >
        <h3 className="text-hive text-sm font-bold uppercase tracking-wider mb-6 opacity-70">Add New Bookmark</h3>
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col gap-4"
          onFocus={() => setFocused(true)}
        >
          <input 
            placeholder="Bookmark Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 text-bee-black outline-none focus:bg-white focus:border-honey/30 transition-all"
          />
          <input 
            placeholder="URL (https://...)" 
            value={url} 
            type="url"
            onChange={(e) => setUrl(e.target.value)} 
            required 
            className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 text-bee-black outline-none focus:bg-white focus:border-honey/30 transition-all"
          />
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="p-4 rounded-lg bg-honey text-bee-black font-semibold cursor-pointer flex justify-center items-center gap-2 hover:bg-honey-dark transition-all disabled:opacity-50"
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
              <><Plus size={20} /> Add Bookmark</>
            )}
          </button>
        </form>
      </motion.div>
    </>
  )
}
