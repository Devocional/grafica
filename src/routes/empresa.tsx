import { createFileRoute } from '@tanstack/react-router';
import { PendingModule } from '@/components/workspace-page';

export const Route = createFileRoute('/empresa')({ component: CompanyPage });

function CompanyPage() {
  return <PendingModule title="Minha empresa" description="Área destinada às informações institucionais e de contato da empresa." sections={['Identificação da empresa', 'Contatos e endereço', 'Atualização do cadastro']} />;
}
