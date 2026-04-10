
Objetivo: corrigir a autenticação sem depender mais de comportamento incerto no banco, porque a causa principal agora está clara no código e no fluxo real.

### O que verifiquei
- `/auth/callback` existe, mas hoje ele **não troca explicitamente o `code` OAuth por sessão**. Ele só:
  - lê erro no `hash`
  - chama `getSession()`
  - espera 1.5s
  - falha com “Sessão não encontrada”
- A gravação da sessão no callback **realmente está falhando no fluxo atual**: o replay mostra `/auth/callback` abrindo e depois exibindo exatamente esse erro.
- O banco **não mostra triggers ativos**, então o app **não pode depender** de criação automática de `profiles` via `auth.users`.
- `Auth.tsx` ainda tem um bug de fluxo: no login por email ele manda direto para `/app`, sem decidir entre `/onboarding` e `/app`.

### Plano de correção

#### 1. Corrigir `/auth/callback` de forma robusta
Atualizar `src/pages/AuthCallback.tsx` para lidar com os dois cenários:
- OAuth com `?code=...` na URL:
  - ler `code` via `URLSearchParams`
  - chamar `supabase.auth.exchangeCodeForSession(code)`
- fluxos com sessão já restaurada:
  - usar `supabase.auth.getSession()` como fallback

Depois disso, a callback deve:
1. garantir que existe `session.user`
2. garantir que existe linha em `profiles`
3. decidir destino:
   - `nome` vazio ou ausente → `/onboarding`
   - `nome` preenchido → `/app`

#### 2. Parar de depender de trigger em `auth.users`
Ajustar o app para criar o perfil base no **frontend autenticado**, usando a policy já existente da tabela `profiles`.

Implementação:
- criar um helper compartilhado, por exemplo em `src/lib/auth.ts`, com algo como:
  - `ensureProfile(user)` → `upsert({ id: user.id, email: user.email })`
  - `getPostAuthDestination(userId)` → consulta `profiles.nome`
- isso substitui a dependência frágil de trigger em schema reservado do Supabase

Motivo:
- hoje o metadata do banco mostra **sem triggers**
- esse modelo é mais estável e compatível com as policies já existentes

#### 3. Corrigir o fluxo de `Auth.tsx`
Atualizar `src/pages/Auth.tsx` para usar o mesmo helper de pós-login.

Regras:
- **Login com email**
  - `signInWithPassword()`
  - depois `ensureProfile(user)`
  - depois redirecionar corretamente:
    - perfil incompleto → `/onboarding`
    - perfil completo → `/app`
- **Signup com email**
  - `signUp()`
  - se vier `session`, fazer `ensureProfile(user)` e mandar para `/onboarding`
  - se não vier `session`, manter mensagem de confirmação por email sem quebrar o fluxo
- **Google**
  - continuar mandando para `/auth/callback`
  - toda decisão de destino fica centralizada na callback

#### 4. Blindar o estado de autenticação
Ajustar o fluxo para evitar corrida entre hidratação da sessão e navegação:
- manter `onAuthStateChange` como fonte principal no `AuthContext`
- evitar decisões prematuras baseadas só em `getSession()` quando o callback ainda está trocando o código
- opcionalmente expor um estado mais explícito de “auth pronta” se necessário, mas sem mudar a arquitetura inteira se o callback já resolver

#### 5. Validar criação real do profile
Depois da correção, validar este cenário como regra funcional:
```text
Landing
→ /auth
→ criar conta / Google
→ /auth/callback
→ ensureProfile()
→ nome vazio? /onboarding : /app
```

Casos que precisam passar:
- signup por email com conta nova
- login por email com conta existente e perfil incompleto
- login por email com perfil completo
- login com Google no domínio publicado
- retorno ao app após logout + novo login

### Arquivos a alterar
- `src/pages/AuthCallback.tsx`
- `src/pages/Auth.tsx`
- `src/contexts/AuthContext.tsx` (somente se o timing de sessão ainda precisar de reforço)
- novo helper compartilhado, ex.: `src/lib/auth.ts`

### Banco de dados
Neste momento, a correção principal deve ser **no app**, não em trigger no `auth.users`.

Observação importante:
- como o projeto já mostra `profiles` com policy de `INSERT` para `authenticated` usando `auth.uid() = id`, o app pode fazer `upsert` do perfil com segurança
- eu **não seguiria** com novas tentativas de trigger em `auth.users`, porque isso é justamente o ponto mais instável do fluxo atual

### Resultado esperado
- Google deixa de parar em “Sessão não encontrada”
- login por email deixa de mandar o usuário para o lugar errado
- criação de conta deixa de depender de trigger invisível
- o app sempre decide corretamente:
  - perfil incompleto → `/onboarding`
  - perfil completo → `/app`

### Detalhes técnicos
- bug crítico 1: callback atual não trata `code` OAuth
- bug crítico 2: perfil automático não é confiável porque o banco atual não mostra trigger ativa
- bug crítico 3: login por email navega direto para `/app`, sem checagem de completude
- warning de `ref` no `LandingHero` existe, mas é secundário e não é a causa da falha de autenticação

### Ordem de implementação
1. criar helper compartilhado de autenticação/perfil
2. corrigir `AuthCallback.tsx` com `exchangeCodeForSession(code)`
3. corrigir `Auth.tsx` para usar o helper após login/signup
4. revisar `AuthContext` apenas se ainda houver corrida de sessão
5. testar ponta a ponta nos fluxos email + Google
