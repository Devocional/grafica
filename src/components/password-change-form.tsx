import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export function PasswordChangeForm() {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError('');
    setMessage('');
    if (!supabase) {
      setError('O serviço de contas está indisponível no momento. Tente novamente mais tarde.');
      return;
    }
    if (password !== confirmation) {
      setError('As senhas não coincidem.');
      return;
    }
    setBusy(true);
    try {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !data.session) {
        setError('Sua sessão expirou. Entre novamente ou solicite outro e-mail de recuperação.');
        return;
      }
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError('Não foi possível alterar a senha. Use uma senha diferente da atual e respeite a política de segurança. Se o link expirou, solicite outro e-mail de recuperação.');
        return;
      }
      setPassword('');
      setConfirmation('');
      setMessage('Senha alterada com sucesso. Use a nova senha nos próximos acessos.');
    } catch {
      setError('Não foi possível concluir a solicitação. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  const inputClass = 'mt-2 min-h-11 w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground disabled:opacity-50';

  return (
    <form onSubmit={submit} className="space-y-5" aria-busy={busy}>
      {error && <p role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
      {message && <p role="status" className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p>}
      <label htmlFor="new-password" className="block text-sm font-medium">Nova senha<input id="new-password" type="password" autoComplete="new-password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} disabled={busy} className={inputClass} aria-describedby="password-help" /></label>
      <p id="password-help" className="text-xs leading-relaxed text-muted-foreground">Use ao menos 6 caracteres e respeite a política de senha da sua conta. Prefira uma senha longa e exclusiva.</p>
      <label htmlFor="new-password-confirmation" className="block text-sm font-medium">Confirmar nova senha<input id="new-password-confirmation" type="password" autoComplete="new-password" required minLength={6} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={busy} className={inputClass} /></label>
      <Button type="submit" disabled={busy || !supabase} className="w-full">{busy ? 'Salvando...' : 'Salvar nova senha'}</Button>
    </form>
  );
}
