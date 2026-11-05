import { createFileRoute } from '@tanstack/react-router';
import { ArrowDownLeft, ArrowUpRight, CalendarDays, CircleAlert, Receipt, Wallet } from 'lucide-react';
import { WorkspacePage } from '@/components/workspace-page';
import { Card } from '@/components/ui/card';

export const Route = createFileRoute('/financeiro')({ component: FinancePage });

const indicators = [
  { title: 'Recebimentos', description: 'Total de entradas realizadas', icon: ArrowDownLeft },
  { title: 'Pagamentos', description: 'Total de saídas realizadas', icon: ArrowUpRight },
  { title: 'Saldo realizado', description: 'Recebimentos menos pagamentos', icon: Wallet },
  { title: 'Saldo previsto', description: 'Saldo realizado mais valores a receber, menos valores a pagar', icon: CalendarDays },
];

function FinancePage() {
  return (
    <WorkspacePage title="Financeiro" description="Acompanhe entradas, saídas e compromissos financeiros da sua empresa em um só lugar.">
      <section aria-labelledby="finance-overview" className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/5" aria-hidden="true" />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/80">Visão geral financeira</p>
            <h2 id="finance-overview" className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Mais clareza para suas finanças</h2>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">Visualize o resultado dos recebimentos e pagamentos e acompanhe os próximos vencimentos.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#contas-receber" className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/20"><ArrowDownLeft className="h-4 w-4" aria-hidden="true" />Contas a receber</a>
              <a href="#contas-pagar" className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/20"><ArrowUpRight className="h-4 w-4" aria-hidden="true" />Contas a pagar</a>
            </div>
          </div>
          <span className="rounded-2xl border border-white/20 bg-white/10 p-4"><Wallet className="h-7 w-7" aria-hidden="true" /></span>
        </div>
      </section>

      <div role="note" className="flex items-start gap-3 rounded-xl border bg-card p-4 text-sm">
        <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <p className="font-semibold">Dados financeiros ainda indisponíveis</p>
          <p className="mt-1 leading-relaxed text-muted-foreground">O banco conectado ainda não possui tabelas financeiras. Os indicadores e as movimentações dependem dessa estrutura; o cadastro de lançamentos ainda não está disponível. O símbolo — indica um valor indisponível, não um saldo zero.</p>
        </div>
      </div>

      <section aria-label="Indicadores financeiros" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {indicators.map(({ title, description, icon: Icon }) => (
          <Card key={title}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
              <span className="rounded-xl bg-primary/10 p-2.5 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span>
            </div>
            <p className="my-4 text-4xl font-semibold tracking-tight" aria-label="Valor indisponível">—</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
          </Card>
        ))}
      </section>

      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        <Card id="contas-receber" className="scroll-mt-6">
          <div className="flex items-start justify-between gap-3 border-b pb-5">
            <div><h2 className="text-lg font-semibold">Contas a receber</h2><p className="mt-1 text-sm text-muted-foreground">Recebimentos pendentes e próximos vencimentos.</p></div>
            <ArrowDownLeft className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/60 p-4"><p className="text-xs text-muted-foreground">Total a receber</p><p className="mt-2 text-xl font-semibold" aria-label="Valor indisponível">—</p></div>
            <div className="rounded-xl bg-muted/60 p-4"><p className="text-xs text-muted-foreground">Valor em atraso</p><p className="mt-2 text-xl font-semibold" aria-label="Valor indisponível">—</p></div>
          </div>
          <div className="flex min-h-44 flex-col items-center justify-center gap-2 py-6 text-center">
            <CalendarDays className="mb-1 h-7 w-7 text-muted-foreground" aria-hidden="true" />
            <h3 className="text-sm font-medium">Recebimentos indisponíveis</h3>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">Os títulos e seus vencimentos serão exibidos após a implementação dos dados financeiros.</p>
          </div>
        </Card>

        <Card id="contas-pagar" className="scroll-mt-6">
          <div className="flex items-start justify-between gap-3 border-b pb-5">
            <div><h2 className="text-lg font-semibold">Contas a pagar</h2><p className="mt-1 text-sm text-muted-foreground">Despesas pendentes e compromissos da empresa.</p></div>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/60 p-4"><p className="text-xs text-muted-foreground">Total a pagar</p><p className="mt-2 text-xl font-semibold" aria-label="Valor indisponível">—</p></div>
            <div className="rounded-xl bg-muted/60 p-4"><p className="text-xs text-muted-foreground">Valor em atraso</p><p className="mt-2 text-xl font-semibold" aria-label="Valor indisponível">—</p></div>
          </div>
          <div className="flex min-h-44 flex-col items-center justify-center gap-2 py-6 text-center">
            <CalendarDays className="mb-1 h-7 w-7 text-muted-foreground" aria-hidden="true" />
            <h3 className="text-sm font-medium">Pagamentos indisponíveis</h3>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">As despesas e seus vencimentos serão exibidos após a implementação dos dados financeiros.</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-3 border-b pb-5">
          <div><h2 className="text-lg font-semibold">Últimas movimentações</h2><p className="mt-1 text-sm text-muted-foreground">Histórico de entradas e saídas realizadas.</p></div>
          <Receipt className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        </div>
        <div className="flex min-h-56 flex-col items-center justify-center gap-3 py-8 text-center">
          <span className="rounded-2xl bg-muted p-4"><Receipt className="h-7 w-7 text-muted-foreground" aria-hidden="true" /></span>
          <h3 className="font-medium">Histórico financeiro indisponível</h3>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">Esta área reunirá a data, a descrição, o tipo e o valor de cada movimentação quando os lançamentos estiverem disponíveis.</p>
        </div>
      </Card>
    </WorkspacePage>
  );
}
