'use client'

import { useCallback, useEffect, useState } from 'react'
import { Bookmark } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import BookmarkCard from './BookmarkCard'

const supabase = createClient()

interface BookmarkListProps {
  refreshTrigger: number
}

export default function BookmarkList({ refreshTrigger }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        console.error('Error getting user:', userError)
        return
      }

      if (!user) {
        console.warn('No user found')
        return
      }

      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching bookmarks:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: error,
        })
        return
      }

      setBookmarks(data || [])
    } catch (err) {
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookmarks()
  }, [refreshTrigger, fetchBookmarks])

  useEffect(() => {
    const getUserAndSubscribe = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Subscribe to real-time changes for this user's bookmarks
      const channel = supabase
        .channel(`bookmarks-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`,
          },
          fetchBookmarks
        )
        .subscribe()

      return () => {
        channel.unsubscribe()
      }
    }

    getUserAndSubscribe()
  }, [fetchBookmarks])

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id)

      if (error) {
        console.error('Error deleting bookmark:', error)
        return
      }

      setBookmarks((prev) => prev.filter((b) => b.id !== id))
    } catch (err) {
      console.error('Error:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-600">Loading bookmarks...</div>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No bookmarks yet. Add one to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Your Bookmarks ({bookmarks.length})
      </h2>
      <div className="grid gap-4">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}
