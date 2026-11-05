import { createFileRoute } from '@tanstack/react-router';
import { PendingModule } from '@/components/workspace-page';

export const Route = createFileRoute('/clientes')({ component: CustomersPage });

function CustomersPage() {
  return <PendingModule title="Clientes" description="Área destinada à organização dos clientes e ao acompanhamento de seus cadastros." sections={['Cadastro de clientes', 'Busca e consulta', 'Histórico de pedidos']} />;
}
