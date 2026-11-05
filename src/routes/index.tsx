import { useCallback, useEffect, useRef, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowDownRight, Building2, CheckCircle2, CircleAlert, Database, LayoutDashboard, Mail, MapPin, Phone, RefreshCw, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { AppNavigation } from '@/components/app-navigation';

export const Route = createFileRoute('/')({ component: Dashboard });

type Company = {
  company_name: string;
  cnpj: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  updated_at: string;
};

type DashboardData = {
  company: Company | null;
  profiles: number | null;
  roles: number | null;
  errors: string[];
  updatedAt: Date | null;
};

const initialData: DashboardData = { company: null, profiles: null, roles: null, errors: [], updatedAt: null };
const numberFormat = new Intl.NumberFormat('pt-BR');

function Dashboard() {
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState(true);
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    try {
      if (!supabase) throw new Error('auth-unavailable');
      const { error } = await supabase.auth.getSession();
      if (error) throw error;
      if (currentRequest !== requestId.current) return;
      // O schema public está vazio. Não consultar tabelas comerciais inexistentes.
      setData({ ...initialData, updatedAt: new Date() });
    } catch {
      if (currentRequest !== requestId.current) return;
      setData({ ...initialData, errors: ['Não foi possível verificar a sessão. Tente novamente na página Minha conta.'] });
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    return () => { requestId.current += 1; };
  }, [load]);

  const companyName = data.company?.company_name || 'Indiana Bella Uniformes';
  const location = [data.company?.city, data.company?.state].filter(Boolean).join(' / ');
  const fields = [data.company?.company_name, data.company?.cnpj, data.company?.phone, data.company?.email, data.company?.address, data.company?.city, data.company?.state];
  const filled = fields.filter((value) => value?.trim()).length;
  const completion = Math.round((filled / fields.length) * 100);
  const companyUpdatedAt = data.company?.updated_at ? new Date(data.company.updated_at) : null;
  const updatedDate = companyUpdatedAt && !Number.isNaN(companyUpdatedAt.getTime()) ? companyUpdatedAt.toLocaleDateString('pt-BR') : '—';

  const stats = [
    { title: 'Perfis cadastrados', value: data.profiles === null ? '—' : numberFormat.format(data.profiles), detail: 'Aguardando estrutura de perfis', icon: Users, color: 'bg-primary/10 text-primary' },
    { title: 'Atribuições de acesso', value: data.roles === null ? '—' : numberFormat.format(data.roles), detail: 'Aguardando estrutura de permissões', icon: ShieldCheck, color: 'bg-violet-50 text-violet-700' },
    { title: 'Cadastro da empresa', value: data.company ? `${completion}%` : '—', detail: data.company ? `${filled} de 7 informações preenchidas` : 'Aguardando estrutura da empresa', icon: Building2, color: 'bg-amber-50 text-amber-700' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#conteudo" className="sr-only z-50 rounded-lg bg-primary p-3 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Pular para o conteúdo</a>
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-card p-6 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">IB</div>
          <div className="min-w-0"><p className="truncate text-sm font-bold" title={companyName}>{companyName}</p><p className="mt-1 text-xs text-muted-foreground">Painel de gestão</p></div>
        </div>
        <p className="mb-3 mt-12 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Workspace</p>
        <AppNavigation vertical />
        <div className="mt-auto rounded-2xl border bg-background p-4">
          <ShieldCheck className="mb-3 h-5 w-5 text-primary" />
          <p className="text-sm font-semibold">Informações protegidas</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Os dados exibidos respeitam as permissões de acesso da sua sessão.</p>
        </div>
        <p className="mt-5 text-center text-[11px] text-muted-foreground">Indiana Bella · Gestão</p>
      </aside>

      <div className="lg:pl-64">
        <header className="flex min-h-20 items-center justify-between gap-4 border-b bg-card px-5 sm:px-8">
          <div className="flex items-center gap-2 text-sm"><LayoutDashboard className="h-4 w-4 text-primary" /><span className="hidden text-muted-foreground sm:inline">Visão geral</span><span className="hidden text-border sm:inline">/</span><span className="font-medium">Dashboard</span></div>
          <div className="flex items-center gap-3"><span className="hidden text-xs capitalize text-muted-foreground md:inline">{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span><span className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted text-xs font-semibold text-primary" aria-label="Indiana Bella">IB</span></div>
        </header>
        <div className="border-b bg-card px-5 py-3 lg:hidden"><AppNavigation /></div>

        <main id="conteudo" className="mx-auto max-w-7xl scroll-mt-6 space-y-7 px-5 py-8 sm:px-8 sm:py-10" aria-busy={loading}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Seu negócio, em um só lugar</p><h1 className="text-3xl font-bold tracking-tight">Dashboard</h1><p className="mt-2 text-sm text-muted-foreground">Acompanhe as informações e a organização da sua empresa.</p></div>
            <Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />{loading ? 'Verificando...' : 'Verificar sessão'}</Button>
          </div>

          <section className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8" aria-labelledby="welcome-title">
            <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border-[40px] border-white/5" aria-hidden="true" />
            <div className="relative max-w-2xl"><span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs"><Sparkles className="h-3.5 w-3.5" />Visão geral da empresa</span><h2 id="welcome-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">Bem-vindo à {companyName}</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">Uma visão clara dos seus cadastros, acessos e informações institucionais para começar o dia com tudo organizado.</p><a href="#empresa" className="mt-6 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-white underline-offset-4 hover:underline">Ver dados da empresa<ArrowDownRight className="h-4 w-4" /></a></div>
          </section>

          {data.errors.length > 0 && <div role="alert" className="flex gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="font-semibold">Alguns dados não estão disponíveis</p><ul className="mt-1 space-y-1">{data.errors.map((error) => <li key={error}>{error}</li>)}</ul></div></div>}

          <section aria-label="Indicadores do dashboard" className="grid gap-4 md:grid-cols-3">
            {stats.map(({ title, value, detail, icon: Icon, color }) => <Card key={title}><div className="flex items-center justify-between gap-3"><h2 className="text-sm font-medium text-muted-foreground">{title}</h2><span className={cn('rounded-xl p-2.5', color)}><Icon className="h-5 w-5" /></span></div>{loading ? <div className="my-4 h-9 w-24 animate-pulse rounded-lg bg-muted" aria-label="Carregando indicador" /> : <p className="my-4 text-4xl font-semibold tracking-tight">{value}</p>}<p className="text-xs text-muted-foreground">{detail}</p></Card>)}
          </section>

          <div className="grid items-start gap-6 xl:grid-cols-[1.6fr_1fr]">
            <Card id="empresa" className="scroll-mt-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-5"><div><h2 className="text-lg font-semibold">Minha empresa</h2><p className="mt-1 text-xs text-muted-foreground">Informações institucionais e de contato</p></div><Building2 className="h-5 w-5 text-primary" /></div>
              {loading ? <div className="mt-6 space-y-5" aria-label="Carregando empresa">{[1, 2, 3].map((row) => <div key={row} className="h-12 animate-pulse rounded-xl bg-muted" />)}</div> : data.company ? <div className="pt-6"><h3 className="text-xl font-semibold">{data.company.company_name}</h3><p className="mt-1 text-xs text-muted-foreground">CNPJ: {data.company.cnpj || 'Não informado'}</p><dl className="mt-7 grid gap-6 sm:grid-cols-2"><Contact icon={Phone} label="Telefone" value={data.company.phone} /><Contact icon={Mail} label="E-mail" value={data.company.email} /><Contact icon={MapPin} label="Endereço" value={data.company.address} /><Contact icon={Building2} label="Cidade / Estado" value={location} /></dl><p className="mt-7 border-t pt-4 text-xs text-muted-foreground">Última alteração do cadastro: {updatedDate}</p></div> : <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center"><Building2 className="h-9 w-9 text-muted-foreground/60" /><h3 className="font-medium">Dados da empresa indisponíveis</h3><p className="max-w-sm text-sm leading-relaxed text-muted-foreground">O banco conectado ainda não possui tabelas para o cadastro da empresa. Os dados serão exibidos após a implementação dessa estrutura.</p></div>}
            </Card>

            <div className="space-y-6">
              <Card><div className="flex items-center gap-3"><span className="rounded-xl bg-primary/10 p-2.5 text-primary"><CheckCircle2 className="h-5 w-5" /></span><h2 className="font-semibold">Qualidade do cadastro</h2></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground">Mantenha as informações da empresa completas para facilitar o contato e a identificação.</p><div className="mb-2 mt-5 flex justify-between text-xs"><span className="text-muted-foreground">Preenchimento</span><span className="font-semibold">{!loading && data.company ? `${completion}%` : '—'}</span></div><div role="progressbar" aria-label="Preenchimento do cadastro" aria-valuemin={0} aria-valuemax={100} aria-valuenow={!loading && data.company ? completion : undefined} className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${!loading && data.company ? completion : 0}%` }} /></div><p className="mt-3 text-xs text-muted-foreground">Nome, CNPJ, telefone, e-mail e endereço completo.</p></Card>
              <Card className="bg-muted/40 shadow-none"><Database className="mb-3 h-5 w-5 text-muted-foreground" /><h2 className="text-sm font-semibold">Estrutura comercial pendente</h2><p className="mt-2 text-xs leading-relaxed text-muted-foreground">O banco conectado está sem tabelas no schema public. Por isso, os indicadores permanecem sem valores, em vez de mostrar contagens fictícias. Login e cadastro estão disponíveis em Minha conta pelo serviço de autenticação.</p></Card>
            </div>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t pt-5 text-xs text-muted-foreground"><p>{companyName}</p><p role="status" aria-live="polite" className="flex items-center gap-2"><span className={cn('h-1.5 w-1.5 rounded-full', loading ? 'bg-amber-500' : data.errors.length ? 'bg-destructive' : 'bg-primary')} />{loading ? 'Verificando sessão...' : data.updatedAt ? `Sessão verificada às ${data.updatedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · Dados comerciais pendentes` : 'Verificação da sessão indisponível'}</p></footer>
        </main>
      </div>
    </div>
  );
}

function Contact({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string | null | undefined }) {
  return <div className="flex min-w-0 items-start gap-3"><span className="rounded-lg bg-muted p-2 text-muted-foreground"><Icon className="h-4 w-4" /></span><div className="min-w-0"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-sm font-medium">{value || 'Não informado'}</dd></div></div>;
}
