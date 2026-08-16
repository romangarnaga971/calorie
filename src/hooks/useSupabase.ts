import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { startOfDay, endOfDay } from 'date-fns'

const supabase = createClient()

export function useUser() {
  const fetcher = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
  return useSWR('auth-user', fetcher)
}

export function useProfile() {
  const { data: user, isLoading: isUserLoading } = useUser()
  const fetcher = async () => {
    if (!user) return null
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    return data
  }
  const swr = useSWR(user ? `profile-${user.id}` : null, fetcher)
  return { ...swr, isLoading: isUserLoading || swr.isLoading }
}

export function useTodayEntries() {
  const { data: user, isLoading: isUserLoading } = useUser()
  const fetcher = async () => {
    if (!user) return []
    const todayStart = startOfDay(new Date()).toISOString()
    const todayEnd = endOfDay(new Date()).toISOString()
    const { data } = await supabase
      .from('food_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('logged_at', todayStart)
      .lte('logged_at', todayEnd)
      .order('logged_at', { ascending: false })
    return data || []
  }
  const swr = useSWR(user ? `entries-today-${user.id}` : null, fetcher)
  return { ...swr, isLoading: isUserLoading || swr.isLoading }
}

export function useTodayWater() {
  const { data: user, isLoading: isUserLoading } = useUser()
  const fetcher = async () => {
    if (!user) return []
    const todayStart = startOfDay(new Date()).toISOString()
    const todayEnd = endOfDay(new Date()).toISOString()
    const { data } = await supabase
      .from('water_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('logged_at', todayStart)
      .lte('logged_at', todayEnd)
      .order('logged_at', { ascending: false })
    return data || []
  }
  const swr = useSWR(user ? `water-today-${user.id}` : null, fetcher)
  return { ...swr, isLoading: isUserLoading || swr.isLoading }
}

export function useChatSessions() {
  const { data: user, isLoading: isUserLoading } = useUser()
  const fetcher = async () => {
    if (!user) return []
    const { data } = await supabase
      .from('chat_sessions')
      .select('id, title, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    return data || []
  }
  const swr = useSWR(user ? `chat-sessions-${user.id}` : null, fetcher)
  return { ...swr, isLoading: isUserLoading || swr.isLoading }
}

export function useChatMessages(sessionId: string) {
  const { data: user, isLoading: isUserLoading } = useUser()
  const fetcher = async () => {
    if (!user || !sessionId) return []
    const { data } = await supabase
      .from('chat_messages')
      .select('id, role, content')
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    return data || []
  }
  const swr = useSWR(user && sessionId ? `chat-messages-${sessionId}` : null, fetcher)
  return { ...swr, isLoading: isUserLoading || swr.isLoading }
}

export function useProgressHistory() {
  const { data: user, isLoading: isUserLoading } = useUser()
  const fetcher = async () => {
    if (!user) return []
    const { data } = await supabase
      .from('food_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('logged_at', { ascending: true })
    return data || []
  }
  const swr = useSWR(user ? `progress-history-${user.id}` : null, fetcher)
  return { ...swr, isLoading: isUserLoading || swr.isLoading }
}

export function useWeightLogs() {
  const { data: user, isLoading: isUserLoading } = useUser()
  const fetcher = async () => {
    if (!user) return []
    const { data } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('logged_at', { ascending: false })
      .limit(14)
    return data || []
  }
  const swr = useSWR(user ? `weight-logs-${user.id}` : null, fetcher)
  return { ...swr, isLoading: isUserLoading || swr.isLoading }
}
