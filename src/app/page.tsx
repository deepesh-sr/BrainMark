import { signIn, auth, signOut } from "@/auth"

export default async function Page() {
  const session = await auth()
 
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem', fontFamily: 'sans-serif' }}>
      {!session ? (
        <>
          <h1>BrainMark</h1>
          <form
            action={async () => {
              "use server"
              await signIn("google")
            }}
          >
            <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
              Sign in with Google
            </button>
          </form>
        </>
      ) : (
        <>
          <h1>Welcome, {session.user?.name}</h1>
          <p>Email: {session.user?.email}</p>
          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
              Sign Out
            </button>
          </form>
        </>
      )}
    </div>
  )
}
