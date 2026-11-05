import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { Database } from 'lucide-react';
import { AppNavigation } from '@/components/app-navigation';
import { Card } from '@/components/ui/card';

export function WorkspacePage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#conteudo" className="sr-only rounded-lg bg-primary p-3 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50">Pular para o conteúdo</a>
      <header className="border-b bg-card px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
          <Link to="/" className="flex items-center gap-3 rounded-lg">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary font-bold text-primary-foreground">IB</span>
            <span><span className="block text-sm font-bold">Indiana Bella Uniformes</span><span className="block text-xs text-muted-foreground">Painel de gestão</span></span>
          </Link>
          <AppNavigation />
        </div>
      </header>
      <main id="conteudo" className="mx-auto max-w-7xl space-y-7 px-5 py-8 sm:px-8 sm:py-10">
        <div><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Gestão da empresa</p><h1 className="text-3xl font-bold tracking-tight">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p></div>
        {children}
      </main>
    </div>
  );
}

export function PendingModule({ title, description, sections }: { title: string; description: string; sections: readonly string[] }) {
  return (
    <WorkspacePage title={title} description={description}>
      <Card className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
        <span className="rounded-2xl bg-primary/10 p-4 text-primary"><Database className="h-7 w-7" aria-hidden="true" /></span>
        <h2 className="text-xl font-semibold">Aguardando estrutura de dados</h2>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">Esta área já possui sua página e navegação. O banco conectado ainda não possui tabelas para este módulo; consultas e gravações comerciais não estão disponíveis nesta etapa.</p>
      </Card>
      <section aria-label="Escopo previsto do módulo" className="grid gap-4 md:grid-cols-3">
        {sections.map((section) => <Card key={section}><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Próxima etapa</p><h2 className="mt-3 font-semibold">{section}</h2><p className="mt-2 text-sm text-muted-foreground">Disponível após a implementação da estrutura de dados correspondente.</p></Card>)}
      </section>
    </WorkspacePage>
  );
}
