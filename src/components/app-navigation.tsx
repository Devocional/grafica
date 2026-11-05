import { Link } from '@tanstack/react-router';
import { Building2, ClipboardList, LayoutDashboard, UserRound, Users, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/empresa', label: 'Minha empresa', icon: Building2 },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/pedidos', label: 'Pedidos', icon: ClipboardList },
  { to: '/financeiro', label: 'Financeiro', icon: Wallet },
  { to: '/conta', label: 'Minha conta', icon: UserRound },
] as const;

export function AppNavigation({ vertical = false }: { vertical?: boolean }) {
  return (
    <nav aria-label="Navegação principal" className={cn('flex gap-2', vertical ? 'flex-col' : 'flex-wrap')}>
      {items.map(({ to, label, icon: Icon }) => (
        <Link key={to} to={to} activeOptions={{ exact: true }} className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-muted" activeProps={{ className: 'bg-primary/10 text-primary', 'aria-current': 'page' }} inactiveProps={{ className: 'text-muted-foreground' }}>
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />{label}
        </Link>
      ))}
    </nav>
  );
}
