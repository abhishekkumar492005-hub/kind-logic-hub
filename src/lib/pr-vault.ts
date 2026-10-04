import { supabase } from '@/integrations/supabase/client'

export type Exercise = { id: string; user_id: string; name: string; category: string; equipment: string; notes: string; created_at: string }
export type Entry = { id: string; user_id: string; exercise_id: string; weight: number; reps: number; performed_at: string; notes: string; created_at: string }
export type Profile = { id: string; name: string; fitness_goal: string; training_days: number; created_at: string }

export async function loadVault(userId: string) {
  const [exercises, entries, profile] = await Promise.all([
    supabase.from('exercises').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('workout_entries').select('*').eq('user_id', userId).order('performed_at', { ascending: true }),
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
  ])
  const error = exercises.error || entries.error || profile.error
  if (error) throw error
  return { exercises: (exercises.data || []) as Exercise[], entries: (entries.data || []).map(e => ({ ...e, weight: Number(e.weight) })) as Entry[], profile: profile.data as Profile | null }
}

export function records(entries: Entry[]) {
  let best = 0
  return entries.filter(e => { if (e.weight > best) { best = e.weight; return true } return false })
}
export function bestFor(id: string, entries: Entry[]) { return Math.max(0, ...entries.filter(e => e.exercise_id === id).map(e => e.weight)) }
export const categories = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Other']
