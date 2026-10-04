import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '@/components/pr-vault/app-shell'
export const Route = createFileRoute('/exercises')({component:()=> <AppShell><Outlet/></AppShell>})
