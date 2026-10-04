import { createFileRoute } from '@tanstack/react-router'
import { ExerciseDetail } from '@/components/pr-vault/views'
export const Route = createFileRoute('/exercises/$id')({head:()=>({meta:[{title:'Exercise History — PR Vault'},{name:'description',content:'Review your workout history and personal record milestones.'},{property:'og:title',content:'Exercise History — PR Vault'},{property:'og:description',content:'Your progress, lift by lift.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),component:ExerciseDetail})
