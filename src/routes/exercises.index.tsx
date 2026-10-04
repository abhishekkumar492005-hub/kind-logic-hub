import { createFileRoute } from '@tanstack/react-router'
import { Exercises } from '@/components/pr-vault/views'
export const Route = createFileRoute('/exercises/')({head:()=>({meta:[{title:'My Exercises — PR Vault'},{name:'description',content:'Find your exercises, personal records, and most recent lifts.'},{property:'og:title',content:'My Exercises — PR Vault'},{property:'og:description',content:'Every exercise and personal best in your vault.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),component:Exercises})
