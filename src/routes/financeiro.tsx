import { createFileRoute } from '@tanstack/react-router';
import { PendingModule } from '@/components/workspace-page';

export const Route = createFileRoute('/financeiro')({ component: FinancePage });

function FinancePage() {
  return <PendingModule title="Financeiro" description="Área destinada à organização financeira e ao acompanhamento dos recebimentos e pagamentos." sections={['Contas a receber', 'Contas a pagar', 'Resumo financeiro']} />;
}
