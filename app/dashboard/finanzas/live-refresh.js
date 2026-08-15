'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LiveRefresh() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('cambios-transacciones')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => router.refresh()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [router])

  return null
}