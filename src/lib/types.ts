export interface Bookmark {
  id: string
  user_id: string
  title: string
  url: string
  created_at: string
}

export interface User {
  id: string
  email: string | null
  user_metadata?: {
    name?: string
    [key: string]: any
  }
}
