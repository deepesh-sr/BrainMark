import { signIn, auth, signOut } from "@/auth"
import BookmarkForm from "@/components/BookmarkForm"
import BookmarkList from "@/components/BookmarkList"

export default async function Page() {
  const session = await auth()
 
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {!session ? (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h1>BrainMark</h1>
          <p>Login to save your bookmarks in one place.</p>
          <form
            action={async () => {
              "use server"
              await signIn("google")
            }}
          >
            <button type="submit" style={{ padding: '12px 24px', fontSize: '1rem', cursor: 'pointer' }}>
              Sign in with Google
            </button>
          </form>
        </div>
      ) : (
        <>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2>Welcome, {session.user?.name}</h2>
            <form
              action={async () => {
                "use server"
                await signOut()
              }}
            >
              <button type="submit">Sign Out</button>
            </form>
          </header>
          
          <main>
            <BookmarkForm />
            <BookmarkList userEmail={session.user?.email || ""} />
          </main>
        </>
      )}
    </div>
  )
}
