import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '@/components/pr-vault/app-shell'
import { Dashboard } from '@/components/pr-vault/views'
export const Route = createFileRoute('/dashboard')({head:()=>({meta:[{title:'Dashboard — PR Vault'},{name:'description',content:'Your personal workout dashboard and latest personal records.'},{property:'og:title',content:'Dashboard — PR Vault'},{property:'og:description',content:'Your workout progress in one place.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),component:()=> <AppShell><Dashboard/></AppShell>})
