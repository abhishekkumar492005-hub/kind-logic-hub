import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '@/components/pr-vault/app-shell'
import { Analytics } from '@/components/pr-vault/views'
export const Route = createFileRoute('/analytics')({head:()=>({meta:[{title:'Progress Analytics — PR Vault'},{name:'description',content:'See your personal record trends, strongest lifts, and monthly progress.'},{property:'og:title',content:'Progress Analytics — PR Vault'},{property:'og:description',content:'See how far your strength has come.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),component:()=> <AppShell><Analytics/></AppShell>})
