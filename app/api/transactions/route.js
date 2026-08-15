import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // Comprobar la clave del atajo
  const auth = req.headers.get('authorization') || ''
  const key = auth.replace('Bearer ', '')

  const { data: keyRow } = await supabase
    .from('api_keys')
    .select('user_id')
    .eq('key', key)
    .single()

  if (!keyRow) {
    return NextResponse.json({ error: 'Clave inválida' }, { status: 401 })
  }

  // Leer el JSON que envía el iPhone
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  // Limpiar y normalizar los datos
  const type = String(body.type || '').trim().toLowerCase()
  const category = String(body.category || '').trim().toLowerCase()
  const amount = Number(String(body.amount || '').replace(',', '.'))
  const note = String(body.note || '').trim() || null

  // Validaciones
  if (!['ingreso', 'gasto'].includes(type)) {
    return NextResponse.json({ error: 'type inválido' }, { status: 400 })
  }
  if (!category) {
    return NextResponse.json({ error: 'category vacía' }, { status: 400 })
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: 'amount inválido' }, { status: 400 })
  }

  // Guardar en la base de datos
  const { error } = await supabase.from('transactions').insert({
    user_id: keyRow.user_id,
    type,
    category,
    amount,
    note,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}