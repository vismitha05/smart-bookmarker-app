## smart bookmarker app
Build a bookmark manager where:

- Users can login using Google OAuth only
- Each user can add bookmarks (title + URL)
- Bookmarks must be private per user
- Changes must reflect in real-time across multiple tabs
- Users can delete their own bookmarks

## Challenges Faced

1. Implementing Google OAuth correctly with Supabase
2. Restricting bookmarks to be visible only to the logged-in user
3. Enabling real-time updates across browser tabs
4. Handling Row Level Security (RLS) policies


# Solutions

- Used Supabase Authentication with Google OAuth provider
- Designed bookmarks table with user_id referencing auth.users
- Enabled Row Level Security (RLS) with policies to restrict access
- Enabled database replication for real-time updates
- Subscribed to postgres_changes using Supabase Realtime

## tech stack: next.js (app router, not page router)
supabase(Auth, database, realtime)
tailwind CSS for basic styling 

