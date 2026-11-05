import { createFileRoute } from '@tanstack/react-router';
import { PendingModule } from '@/components/workspace-page';

export const Route = createFileRoute('/pedidos')({ component: OrdersPage });

function OrdersPage() {
  return <PendingModule title="Pedidos" description="Área destinada ao acompanhamento dos pedidos, desde a solicitação até a entrega." sections={['Registro de pedidos', 'Itens e valores', 'Status e prazos']} />;
}
