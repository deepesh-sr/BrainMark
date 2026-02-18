"use server"

import { auth } from "@/auth"
import { supabase } from "@/utils/supabase"

export async function addBookmark(title: string, url: string) {
  const session = await auth()
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .insert([
      { title, url, user_email: session.user.email }
    ])

  if (error) throw error
  return data
}

export async function deleteBookmark(id: string) {
  const session = await auth()
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .match({ id, user_email: session.user.email })

  if (error) throw error
}
