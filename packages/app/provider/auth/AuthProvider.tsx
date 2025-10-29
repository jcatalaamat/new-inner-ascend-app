import { Database } from '@my/supabase/types'
import { createBrowserClient } from '@supabase/ssr'
import { createContext, useContext, useEffect, useState } from 'react'
import type { SupabaseClient, Session } from '@supabase/supabase-js'

import { AuthStateChangeHandler } from './AuthStateChangeHandler'

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export type AuthProviderProps = {
  initialSession?: Session | null
  children?: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [supabase] = useState(() =>
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )

  return (
    <Context.Provider value={{ supabase }}>
      <AuthStateChangeHandler />
      {children}
    </Context.Provider>
  )
}

export const useSupabaseClient = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabaseClient must be used within AuthProvider')
  }
  return context.supabase
}
