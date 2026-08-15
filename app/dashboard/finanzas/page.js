import { createClient } from '@/lib/supabase/server'

const COLORS = {
  vinted: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  wallapop: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  etsy: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  producto: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  impuestos: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  embalaje: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  otra: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
}

const fmt = (n) => n.toFixed(2) + ' €'
const keyOf = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

function Badge({ value }) {
  const k = String(value).toLowerCase()
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${COLORS[k] || COLORS.otra}`}>
      {value}
    </span>
  )
}

function Kpi({ title, value, sub, color }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <p className="text-sm text-neutral-400">{title}</p>
      <p className={`mt-1 text-2xl font-bold ${color || 'text-white'}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-neutral-500">{sub}</p>}
    </div>
  )
}

export default async function FinanzasPage() {
  const supabase = await createClient()
  const { data: txs = [] } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })

  const sum = (list) => list.reduce((s, t) => s + Number(t.amount), 0)
  const ing = txs.filter((t) => t.type === 'ingreso')
  const gas = txs.filter((t) => t.type === 'gasto')
  const ingresos = sum(ing)
  const gastos = sum(gas)
  const beneficio = ingresos - gastos
  const margen = ingresos > 0 ? (beneficio / ingresos) * 100 : 0

  const now = new Date()
  const thisMonth = keyOf(now)
  const sameMonth = (iso) => keyOf(new Date(iso)) === thisMonth
  const ingMes = sum(ing.filter((t) => sameMonth(t.created_at)))
  const gasMes = sum(gas.filter((t) => sameMonth(t.created_at)))

  // Últimos 6 meses para el gráfico
  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const k = keyOf(d)
    months.push({
      key: k,
      label: d.toLocaleDateString('es-ES', { month: 'short' }),
      ing: sum(ing.filter((t) => keyOf(new Date(t.created_at)) === k)),
      gas: sum(gas.filter((t) => keyOf(new Date(t.created_at)) === k)),
    })
  }
  const max = Math.max(...months.map((m) => Math.max(m.ing, m.gas)), 1)

  const byCat = (list) => {
    const map = {}
    list.forEach((t) => { map[t.category] = (map[t.category] || 0) + Number(t.amount) })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }
  const ingCats = byCat(ing)
  const gasCats = byCat(gas)

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold">💶 Finanzas</h1>
        <p className="text-sm text-neutral-400">Resumen de tu negocio de reventa</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi title="Ingresos" value={fmt(ingresos)} sub={`este mes: ${fmt(ingMes)}`} color="text-green-400" />
        <Kpi title="Gastos" value={fmt(gastos)} sub={`este mes: ${fmt(gasMes)}`} color="text-red-400" />
        <Kpi title="Beneficio" value={fmt(beneficio)} sub={`este mes: ${fmt(ingMes - gasMes)}`} />
        <Kpi title="Margen" value={margen.toFixed(0) + ' %'} sub="sobre ingresos" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-300">Últimos 6 meses</h2>
            <div className="flex gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> Ingresos</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> Gastos</span>
            </div>
          </div>
          <div className="flex h-40 items-end gap-3">
            {months.map((m) => (
              <div key={m.key} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full items-end justify-center gap-1">
                  <div className="w-4 rounded-t bg-green-500" style={{ height: `${(m.ing / max) * 100}%` }} />
                  <div className="w-4 rounded-t bg-red-500" style={{ height: `${(m.gas / max) * 100}%` }} />
                </div>
                <span className="text-xs capitalize text-neutral-500">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="mb-4 text-sm font-semibold text-neutral-300">Ingresos por plataforma</h2>
            <div className="space-y-3">
              {ingCats.map(([cat, val]) => (
                <div key={cat}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="capitalize text-neutral-400">{cat}</span>
                    <span className="text-neutral-300">{fmt(val)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-neutral-800">
                    <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${(val / ingresos) * 100}%` }} />
                  </div>
                </div>
              ))}
              {ingCats.length === 0 && <p className="text-xs text-neutral-500">Sin datos aún</p>}
            </div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="mb-4 text-sm font-semibold text-neutral-300">Gastos por categoría</h2>
            <div className="space-y-3">
              {gasCats.map(([cat, val]) => (
                <div key={cat}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="capitalize text-neutral-400">{cat}</span>
                    <span className="text-neutral-300">{fmt(val)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-neutral-800">
                    <div className="h-1.5 rounded-full bg-red-500" style={{ width: `${(val / gastos) * 100}%` }} />
                  </div>
                </div>
              ))}
              {gasCats.length === 0 && <p className="text-xs text-neutral-500">Sin datos aún</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-left text-neutral-400">
              <th className="p-4 font-medium">Tipo</th>
              <th className="p-4 font-medium">Categoría</th>
              <th className="p-4 font-medium">Nota</th>
              <th className="p-4 font-medium">Fecha</th>
              <th className="p-4 text-right font-medium">Importe</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((t) => (
              <tr key={t.id} className="border-b border-neutral-800/50 last:border-0">
                <td className="p-4">{t.type === 'ingreso' ? '💰' : '💸'}</td>
                <td className="p-4"><Badge value={t.category} /></td>
                <td className="p-4 text-neutral-400">{t.note || '—'}</td>
                <td className="p-4 text-neutral-400">{new Date(t.created_at).toLocaleDateString('es-ES')}</td>
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