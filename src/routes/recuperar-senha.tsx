import { useEffect, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import type { Session } from '@supabase/supabase-js';
import { ShieldCheck } from 'lucide-react';
import { WorkspacePage } from '@/components/workspace-page';
import { PasswordChangeForm } from '@/components/password-change-form';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

export const Route = createFileRoute('/recuperar-senha')({ component: RecoverPasswordPage });

function RecoverPasswordPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setError('O serviço de contas está indisponível no momento. Tente novamente mais tarde.');
      setLoading(false);
      return;
    }
    let active = true;
    let authChanged = false;
    const { data } = client.auth.onAuthStateChange((_event, nextSession) => {
      authChanged = true;
      if (active) {
        setSession(nextSession);
        setLoading(false);
        setError('');
      }
    });
    void client.auth.getSession().then(({ data: result, error: sessionError }) => {
      if (!active || authChanged) return;
      setSession(result.session);
      if (sessionError) setError('Não foi possível validar o acesso. Solicite um novo link de recuperação.');
      setLoading(false);
    }).catch(() => {
      if (!active || authChanged) return;
      setError('Não foi possível validar o acesso. Tente novamente ou solicite um novo link.');
      setLoading(false);
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);

  return (
    <WorkspacePage title="Definir nova senha" description="Proteja sua conta escolhendo uma nova senha de acesso.">
      <Card className="mx-auto w-full max-w-lg" aria-busy={loading}>
        <div className="mb-6 flex items-center gap-3"><span className="rounded-xl bg-primary/10 p-3 text-primary"><ShieldCheck className="h-6 w-6" aria-hidden="true" /></span><h2 className="text-xl font-semibold">Segurança da conta</h2></div>
        {error && <p role="alert" className="mb-5 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
        {loading ? <p role="status" className="py-8 text-center text-sm text-muted-foreground">Validando seu acesso...</p> : session ? <PasswordChangeForm key={session.user.id} /> : <div className="space-y-3 rounded-xl bg-muted/50 p-5"><h3 className="font-semibold">É necessário validar seu acesso</h3><p className="text-sm leading-relaxed text-muted-foreground">Abra o link recebido por e-mail. Se ele expirou ou já foi utilizado, vá para Minha conta e escolha “Esqueci minha senha” para solicitar outro.</p></div>}
        <Link to="/conta" className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-muted">Voltar para Minha conta</Link>
      </Card>
    </WorkspacePage>
  );
}
