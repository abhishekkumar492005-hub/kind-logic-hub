import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '@/components/pr-vault/auth'
export const Route = createFileRoute('/auth')({head:()=>({meta:[{title:'Sign in or join — PR Vault'},{name:'description',content:'Create your free PR Vault account or log in to keep your personal records close.'},{property:'og:title',content:'Join PR Vault'},{property:'og:description',content:'Start tracking your strongest lifts for free.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),component:AuthPage})
