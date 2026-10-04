import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '@/components/pr-vault/app-shell'
import { ProfileView } from '@/components/pr-vault/views'
export const Route = createFileRoute('/profile')({head:()=>({meta:[{title:'My Profile — PR Vault'},{name:'description',content:'Manage your fitness goals, training days, and personal PR Vault profile.'},{property:'og:title',content:'My Profile — PR Vault'},{property:'og:description',content:'Your strength journey, your way.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),component:()=> <AppShell><ProfileView/></AppShell>})
