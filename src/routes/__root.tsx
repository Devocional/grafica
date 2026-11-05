import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: () => (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center text-foreground">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="text-3xl font-bold">Página não encontrada</h1>
      <Link to="/" className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Voltar ao dashboard</Link>
    </main>
  ),
});
