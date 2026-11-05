import { useEffect, useState, type FormEvent } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import type { Session } from '@supabase/supabase-js';
import { LogOut, ShieldCheck } from 'lucide-react';
import { WorkspacePage } from '@/components/workspace-page';
import { PasswordChangeForm } from '@/components/password-change-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

export const Route = createFileRoute('/conta')({ component: AccountPage });

function AccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup' | 'recover'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
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
      }
    });
    void client.auth.getSession().then(({ data: result, error: sessionError }) => {
      if (!active || authChanged) return;
      setSession(result.session);
      if (sessionError) setError('Não foi possível recuperar sua sessão. Tente entrar novamente.');
      setLoading(false);
    }).catch(() => {
      if (!active || authChanged) return;
      setError('Não foi possível recuperar sua sessão. Tente entrar novamente.');
      setLoading(false);
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !supabase) return;
    setError('');
    setMessage('');
    if (mode === 'signup' && password !== confirmation) {
      setError('As senhas não coincidem.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'recover') {
        const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: new URL('/recuperar-senha', window.location.origin).toString(),
        });
        if (recoveryError) {
          setError('Não foi possível solicitar a recuperação. Aguarde alguns instantes e tente novamente.');
          return;
        }
        setPassword('');
        setConfirmation('');
        setMessage('Se houver uma conta elegível para este e-mail, você receberá um link para definir uma nova senha. Confira também a pasta de spam.');
        return;
      }
      if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({ email: email.trim(), password });
        if (authError) {
          setError('Não foi possível concluir o cadastro. Verifique os dados e a política de senha ou tente novamente mais tarde.');
          return;
        }
        setSession(data.session);
        setMessage(data.session ? 'Conta criada e sessão iniciada.' : 'Confira seu e-mail para confirmar o cadastro antes de entrar.');
      } else {
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) {
          setError('Não foi possível entrar. Confira o e-mail, a senha e a confirmação do cadastro.');
          return;
        }
        setSession(data.session);
        setMessage('Login realizado com sucesso.');
      }
      setPassword('');
      setConfirmation('');
    } catch {
      setError('Não foi possível concluir a solicitação. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    if (!supabase || busy) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const { error: authError } = await supabase.auth.signOut();
      if (authError) {
        setError('Não foi possível sair. Tente novamente.');
        return;
      }
      setSession(null);
      setPassword('');
      setConfirmation('');
      setMessage('Você saiu da sua conta.');
    } catch {
      setError('Não foi possível sair. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  const inputClass = 'mt-2 min-h-11 w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground disabled:opacity-50';

  return (
    <WorkspacePage title="Minha conta" description="Entre com sua conta ou crie um cadastro para acessar sua sessão.">
      <Card className="mx-auto w-full max-w-lg" aria-busy={loading || busy}>
        <div className="mb-6 flex items-center gap-3"><span className="rounded-xl bg-primary/10 p-3 text-primary"><ShieldCheck className="h-6 w-6" /></span><h2 className="text-xl font-semibold">{session ? 'Sessão ativa' : mode === 'recover' ? 'Recuperar senha' : mode === 'login' ? 'Entrar na conta' : 'Criar conta'}</h2></div>
        {error && <p role="alert" className="mb-5 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
        {message && <p role="status" className="mb-5 rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p>}
        {loading ? <p role="status" className="py-8 text-center text-sm text-muted-foreground">Carregando sua sessão...</p> : session ? (
          <div className="space-y-6"><div><p className="text-xs text-muted-foreground">E-mail da conta</p><p className="mt-1 break-words font-medium">{session.user.email || 'Não informado'}</p></div><p className="text-sm leading-relaxed text-muted-foreground">Sua autenticação é gerenciada pelo Supabase. O cadastro de perfil e as permissões comerciais ainda dependem da estrutura de dados da empresa.</p><Button variant="outline" disabled={busy} onClick={() => void signOut()}><LogOut className="h-4 w-4" />{busy ? 'Saindo...' : 'Sair da conta'}</Button></div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <label htmlFor="email" className="block text-sm font-medium">E-mail<input id="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} disabled={busy} className={inputClass} /></label>
            {mode === 'recover' ? <p className="text-sm leading-relaxed text-muted-foreground">Informe o e-mail da sua conta para receber um link de recuperação de senha.</p> : <label htmlFor="password" className="block text-sm font-medium">Senha<input id="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={mode === 'signup' ? 6 : undefined} value={password} onChange={(event) => setPassword(event.target.value)} disabled={busy} className={inputClass} /></label>}
            {mode === 'signup' && <label htmlFor="confirmation" className="block text-sm font-medium">Confirmar senha<input id="confirmation" type="password" autoComplete="new-password" required minLength={6} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={busy} className={inputClass} /><span className="mt-2 block text-xs font-normal text-muted-foreground">Use ao menos 6 caracteres, respeitando a política de senha do serviço.</span></label>}
            <Button type="submit" disabled={busy || !supabase} className="w-full">{busy ? 'Aguarde...' : mode === 'recover' ? 'Enviar link de recuperação' : mode === 'login' ? 'Entrar' : 'Criar conta'}</Button>
            {mode === 'login' && <Button type="button" variant="ghost" className="w-full" disabled={busy} onClick={() => { setMode('recover'); setPassword(''); setConfirmation(''); setError(''); setMessage(''); }}>Esqueci minha senha</Button>}
            <Button type="button" variant="ghost" className="w-full" disabled={busy} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setPassword(''); setConfirmation(''); setError(''); setMessage(''); }}>{mode === 'login' ? 'Ainda não tenho conta' : mode === 'recover' ? 'Voltar para o login' : 'Já tenho conta'}</Button>
          </form>
        )}
      </Card>
      {!loading && session && <Card className="mx-auto w-full max-w-lg"><h2 className="text-xl font-semibold">Alterar senha</h2><p className="mb-6 mt-2 text-sm text-muted-foreground">Atualize a senha usada para entrar na sua conta.</p><PasswordChangeForm key={session.user.id} /></Card>}
    </WorkspacePage>
  );
}
