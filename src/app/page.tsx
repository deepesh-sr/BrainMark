"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import BookmarkForm from "@/components/BookmarkForm"
import BookmarkList from "@/components/BookmarkList"
import { motion } from "framer-motion"

export default function Page() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{ width: '12px', height: '12px', backgroundColor: '#fab005', borderRadius: '50%' }}
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    )
  }
 
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fab005' }}>
      {!session ? (
        <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
          <video 
            autoPlay 
            muted 
            loop 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              minWidth: '100%', 
              minHeight: '100%',
              objectFit: 'cover',
              zIndex: 0,
              opacity: 0.4
            }}
          >
            <source src="https://cdn.pixabay.com/video/2016/09/14/5248-183786781_large.mp4" type="video/mp4" />
          </video>
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center', padding: '0 20px' }}>
            <h1 style={{ fontFamily: "'Fredericka the Great', serif", fontSize: '4rem', margin: 0, color: '#fab005' }}>
              BrainMark
            </h1>
            <p style={{ maxWidth: '500px', fontSize: '1.1rem', marginBottom: '2rem', color: '#eee' }}>
              Your digital hive for storing precious nectar.
            </p>
            <button
              onClick={() => signIn("google")}
              style={{ 
                padding: '16px 32px', 
                fontSize: '1rem', 
                cursor: 'pointer', 
                backgroundColor: '#fab005', 
                color: '#000', 
                border: 'none', 
                borderRadius: '50px', 
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(250, 176, 5, 0.4)'
              }}
            >
              Sign in with Google
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <motion.h2
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ 
                background: 'linear-gradient(90deg, #fab005, #ffd43b, #fab005)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: "'Fredericka the Great', serif",
                fontSize: '1.8rem',
                margin: 0
              }}
            >
              BrainMark
            </motion.h2>
            <button 
              onClick={() => signOut()}
              style={{ background: 'none', border: '1px solid #fab005', color: '#fab005', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Fly Out
            </button>
          </header>
          
          <main>
            <div style={{ marginBottom: '1rem', opacity: 0.8, fontSize: '0.9rem' }}>
              Hello, {session.user?.name} 🐝
            </div>
            <BookmarkForm />
            <BookmarkList userEmail={session.user?.email || ""} />
          </main>
        </div>
      )}
    </div>
  )
}
