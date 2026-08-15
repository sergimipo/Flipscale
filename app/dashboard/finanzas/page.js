import { createClient } from '@/lib/supabase/server'

export default async function FinanzasPage() {
  const supabase = await createClient()

  const { data: txs = [] } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })

  const sum = (list) => list.reduce((s, t) => s + Number(t.amount), 0)
  const ingresos = sum(txs.filter((t) => t.type === 'ingreso'))
  const gastos = sum(txs.filter((t) => t.type === 'gasto'))
  const beneficio = ingresos - gastos
  const fmt = (n) => n.toFixed(2) + ' €'

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">💶 Finanzas</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <p className="text-sm text-neutral-400">Ingresos</p>
          <p className="text-2xl font-bold text-green-400">{fmt(ingresos)}</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <p className="text-sm text-neutral-400">Gastos</p>
          <p className="text-2xl font-bold text-red-400">{fmt(gastos)}</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <p className="text-sm text-neutral-400">Beneficio</p>
          <p className="text-2xl font-bold">{fmt(beneficio)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-left text-neutral-400">
              <th className="p-4">Tipo</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Nota</th>
              <th className="p-4">Fecha</th>
              <th className="p-4 text-right">Importe</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((t) => (
              <tr key={t.id} className="border-b border-neutral-800/50">
                <td className="p-4">{t.type === 'ingreso' ? '💰' : '💸'}</td>
                <td className="p-4 capitalize">{t.category}</td>
                <td className="p-4 text-neutral-400">{t.note || '—'}</td>
                <td className="p-4 text-neutral-400">
                  {new Date(t.created_at).toLocaleDateString('es-ES')}
                </td>
                <td className={`p-4 text-right font-semibold ${t.type === 'ingreso' ? 'text-green-400' : 'text-red-400'}`}>
                  {t.type === 'ingreso' ? '+' : '-'}{fmt(Number(t.amount))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}