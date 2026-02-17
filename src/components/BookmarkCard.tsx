'use client'

import { Bookmark } from '@/lib/types'

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: (id: string) => void
}

export default function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      onDelete(bookmark.id)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <a 
          href={bookmark.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-semibold text-blue-600 hover:text-blue-700 truncate block"
        >
          {bookmark.title}
        </a>
        <p className="text-sm text-gray-600 truncate">{bookmark.url}</p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(bookmark.created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="flex gap-2 ml-4 flex-shrink-0">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
          title="Open link"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
        <button
          onClick={handleDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition"
          title="Delete bookmark"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </div>
  )
}
