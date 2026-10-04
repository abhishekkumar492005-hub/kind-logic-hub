import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, createContext, useContext, type ReactNode } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { loadVault, type Exercise, type Entry, type Profile, bestFor, categories } from '@/lib/pr-vault'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LayoutDashboard, Dumbbell, ChartNoAxesCombined, UserRound, Plus, LogOut, Menu, X, ArrowUpRight, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

type VaultContext = { userId: string; name: string; exercises: Exercise[]; entries: Entry[]; profile: Profile | null; refresh: () => Promise<void>; openAdd: (exerciseId?: string) => void }
const Context = createContext<VaultContext | null>(null)
export function useVault() { const value = useContext(Context); if (!value) throw new Error('Vault context missing'); return value }
export function Brand({ compact = false }: { compact?: boolean }) { return <Link to="/" className="inline-flex items-center gap-2.5 font-display font-black text-xl uppercase tracking-normal text-foreground"><span className="brand-mark"><Zap size={18} fill="currentColor" /></span>{!compact && <>PR<span className="text-primary">VAULT</span></>}</Link> }

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ id: string; email?: string; name?: string } | null>(null)
  const [ready, setReady] = useState(false)
  const [data, setData] = useState<{ exercises: Exercise[]; entries: Entry[]; profile: Profile | null }>({ exercises: [], entries: [], profile: null })
  const [addOpen, setAddOpen] = useState(false)
  const [chosen, setChosen] = useState('')
  const [menu, setMenu] = useState(false)
  const refresh = async (id = user?.id) => { if (!id) return; try { setData(await loadVault(id)) } catch (e) { toast.error(e instanceof Error ? e.message : 'Could not load your vault') } }
  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data: auth }) => { if (!mounted) return; if (auth.user) { setUser({ id: auth.user.id, email: auth.user.email, name: auth.user.user_metadata?.name }); void refresh(auth.user.id) } else navigate({ to: '/auth' }); setReady(true) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { if (!session && mounted) { setUser(null); navigate({ to: '/auth' }) } })
    return () => { mounted = false; listener.subscription.unsubscribe() }
  }, [])
  const openAdd = (exerciseId = '') => { setChosen(exerciseId); setAddOpen(true) }
  if (!ready || !user) return <div className="grid min-h-screen place-items-center text-primary"><Dumbbell className="animate-pulse" size={32}/></div>
  const value = { userId: user.id, name: data.profile?.name || user.name || user.email?.split('@')[0] || 'Athlete', ...data, refresh: () => refresh(), openAdd }
  const nav = [ { to: '/dashboard' as const, label: 'Home', icon: LayoutDashboard }, { to: '/exercises' as const, label: 'Exercises', icon: Dumbbell }, { to: '/analytics' as const, label: 'Analytics', icon: ChartNoAxesCombined }, { to: '/profile' as const, label: 'Profile', icon: UserRound } ]
  return <Context.Provider value={value}><div className="min-h-screen bg-background text-foreground"><aside className="app-sidebar"><Brand/><div className="mt-14 space-y-1">{nav.map(n => <Link key={n.to} to={n.to} className="sidebar-link" activeProps={{ className: 'sidebar-link active' }}><n.icon size={18}/>{n.label}</Link>)}</div><div className="mt-auto border-t border-border pt-5"><div className="mb-4 flex items-center gap-3"><div className="avatar-initial">{value.name.charAt(0).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-sm font-semibold">{value.name}</p><p className="text-xs text-muted-foreground">Free plan</p></div></div><Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={async () => { await supabase.auth.signOut(); navigate({ to: '/' }) }}><LogOut/> Sign out</Button></div></aside>
  <div className="app-main"><header className="app-topbar"><div className="md:hidden"><Brand/></div><div className="hidden text-xs font-semibold uppercase text-muted-foreground md:block">Your strength, in one place.</div><div className="ml-auto flex items-center gap-2"><span className="hidden text-sm text-muted-foreground sm:inline">Keep showing up. It adds up.</span><Button onClick={() => openAdd()} className="hidden sm:inline-flex"><Plus/> Log a lift</Button><Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</Button></div></header>{menu && <div className="mobile-menu">{nav.map(n => <Link key={n.to} to={n.to} onClick={() => setMenu(false)} className="sidebar-link"><n.icon size={18}/>{n.label}</Link>)}<Button variant="ghost" onClick={async () => { await supabase.auth.signOut(); navigate({ to: '/' }) }}>Sign out</Button></div>}<main className="app-content">{children}</main></div>
  <nav className="bottom-nav">{nav.slice(0,2).map(n => <Link key={n.to} to={n.to} className="bottom-item" activeProps={{ className: 'bottom-item selected' }}><n.icon size={20}/><span>{n.label}</span></Link>)}<Button className="bottom-add" aria-label="Add PR" onClick={() => openAdd()}><Plus size={24}/></Button>{nav.slice(2).map(n => <Link key={n.to} to={n.to} className="bottom-item" activeProps={{ className: 'bottom-item selected' }}><n.icon size={20}/><span>{n.label}</span></Link>)}</nav>
  <AddLift open={addOpen} onOpenChange={setAddOpen} selected={chosen} onSaved={value.refresh} exercises={data.exercises} userId={user.id}/><Toaster richColors position="top-right"/></div></Context.Provider>
}
function AddLift({ open, onOpenChange, selected, onSaved, exercises, userId }: { open: boolean; onOpenChange: (v:boolean)=>void; selected: string; onSaved: ()=>Promise<void>; exercises: Exercise[]; userId: string }) {
  const [exerciseId, setExerciseId] = useState(''); const [newName, setNewName] = useState(''); const [category, setCategory] = useState('Chest'); const [equipment, setEquipment] = useState(''); const [weight, setWeight] = useState(''); const [reps, setReps] = useState('1'); const [date, setDate] = useState(''); const [notes, setNotes] = useState(''); const [saving, setSaving] = useState(false)
  useEffect(() => { if (open) { setExerciseId(selected); setDate(new Date().toISOString().slice(0,10)); setWeight(''); setReps('1'); setNewName(''); setNotes('') } }, [open, selected])
  const submit = async (e: React.FormEvent) => { e.preventDefault(); if (!Number.isFinite(Number(weight)) || Number(weight) <= 0 || Number(reps) < 1) return toast.error('Enter a valid weight and reps'); setSaving(true)
    try { let id = exerciseId
      if (!id) { if (!newName.trim()) throw new Error('Enter an exercise name'); if (exercises.length >= 5) throw new Error('Free accounts can track up to 5 exercises.'); const { data, error } = await supabase.from('exercises').insert({ user_id: userId, name: newName.trim(), category, equipment, notes }).select('id').single(); if (error) throw error; id = data.id }
      const { data: previous, error: readError } = await supabase.from('workout_entries').select('weight').eq('exercise_id', id).order('weight', { ascending: false }).limit(1); if (readError) throw readError
      const before = Number(previous?.[0]?.weight || 0)
      const { error } = await supabase.from('workout_entries').insert({ user_id: userId, exercise_id: id, weight: Number(weight), reps: Number(reps), performed_at: date, notes }); if (error) throw error
      await onSaved(); onOpenChange(false); if (Number(weight) > before) toast.success(before ? `🔥 NEW PR! +${Number(weight) - before} KG` : 'Your first PR is in the vault!'); else toast.success('Workout logged. Keep going!')
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Could not save your lift') } finally { setSaving(false) } }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-md"><DialogHeader><DialogTitle className="font-display text-2xl uppercase">Log a lift<span className="text-primary">.</span></DialogTitle></DialogHeader><form className="space-y-4" onSubmit={submit}><label className="form-label">Exercise<select className="form-control" value={exerciseId} onChange={e => setExerciseId(e.target.value)}><option value="">+ New exercise</option>{exercises.map(x => <option key={x.id} value={x.id}>{x.name} · {bestFor(x.id, [])} kg</option>)}</select></label>{!exerciseId && <><label className="form-label">Exercise name<Input value={newName} onChange={e => setNewName(e.target.value)} required placeholder="e.g. Bench Press"/></label><div className="grid grid-cols-2 gap-3"><label className="form-label">Category<select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label className="form-label">Equipment<Input placeholder="e.g. Barbell" value={equipment} onChange={e => setEquipment(e.target.value)}/></label></div></>}<div className="grid grid-cols-2 gap-3"><label className="form-label">Weight (kg)<Input type="number" min="0.01" step="0.01" value={weight} onChange={e => setWeight(e.target.value)} required placeholder="60" autoFocus/></label><label className="form-label">Reps<Input type="number" min="1" value={reps} onChange={e => setReps(e.target.value)} required/></label></div><label className="form-label">Date<Input type="date" value={date} onChange={e => setDate(e.target.value)} required/></label><label className="form-label">Notes (optional)<Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="How did it feel?"/></label><Button className="h-11 w-full" disabled={saving}>{saving ? 'Saving...' : 'Save lift'} <ArrowUpRight/></Button></form></DialogContent></Dialog>
}
