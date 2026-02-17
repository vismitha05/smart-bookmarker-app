'use client'

import { useState, useEffect } from 'react'
import AddBookmark from '@/components/AddBookmark'
import BookmarkList from '@/components/BookmarkList'
import SignOutButton from '@/components/SignOutButton'
import { createClient } from '@/lib/supabase/client'
import { User } from '@/lib/types'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth')
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUser({
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
        })
      }

      setLoading(false)
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push('/auth')
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [router, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Bookmark App</h1>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-gray-600">
                  {user.user_metadata?.name || user.email}
                </span>
                <SignOutButton />
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <AddBookmark onBookmarkAdded={() => setRefreshTrigger((prev) => prev + 1)} />
        <BookmarkList refreshTrigger={refreshTrigger} />
      </main>
    </div>
  )
}
