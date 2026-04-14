

# Validação Profissional em Tempo Real no Onboarding

## O que muda

Transformar o onboarding de um formulário simples para uma experiência profissional com feedback visual imediato, indicadores de campos obrigatórios e barra de progresso clara.

## Alterações no `src/pages/Onboarding.tsx`

### 1. Estado de validação com "touched"
- Adicionar estado `touched: Record<string, boolean>` para rastrear quais campos o usuário já interagiu
- Mostrar erros apenas após o campo ser tocado OU ao tentar clicar "Continuar"
- Adicionar estado `attemptedNext: boolean` que ativa quando o usuário clica "Continuar" sem preencher tudo

### 2. Asterisco (*) nos labels obrigatórios
- Criar componente `RequiredLabel` que renderiza o label com `*` vermelho
- Aplicar em: Nome, Idade, Estado, Cidade, Religião, Intenção de relacionamento, Bio
- Texto "Campo obrigatório" em vermelho abaixo de campos vazios quando tocados

### 3. Mensagens de erro em tempo real
- Nome vazio: "Este campo é obrigatório"
- Idade vazia ou < 18: "Você precisa ter pelo menos 18 anos"
- Estado/Cidade vazios: "Este campo é obrigatório"
- Fotos < 3: "Você precisa adicionar pelo menos 3 fotos" (em vermelho)
- Interesses < 3: "Escolha pelo menos 3 interesses" (contador em vermelho/verde)
- Bio vazia ou < 20 chars: "A bio deve ter pelo menos 20 caracteres"
- Verificação incompleta: "Envie todos os 3 documentos"

### 4. Feedback visual verde/vermelho
- Campos preenchidos corretamente: borda verde (`border-green-500`) + check icon
- Campos com erro: borda vermelha (`border-destructive`) + mensagem vermelha
- Fotos: contador verde quando >= 3, vermelho quando < 3
- Interesses: contador verde quando >= 3

### 5. Barra de progresso com texto
- Substituir as barras finas atuais por uma barra de progresso mais visível
- Adicionar texto "Passo X de 7" acima da barra
- Usar o componente `Progress` existente com estilo gold
- Mostrar nome do passo atual (ex: "Sobre você", "Suas fotos", etc.)

### 6. Botão "Continuar" com feedback
- Quando desabilitado: opacidade reduzida + tooltip visual
- Ao clicar com campos incompletos: ativar `attemptedNext` para mostrar todos os erros de uma vez
- Loading spinner ao enviar no último passo

## Detalhes Técnicos

```text
Barra de progresso:
┌──────────────────────────────────────┐
│  Passo 3 de 7 — Suas fotos          │
│  [████████████░░░░░░░░░░]            │
└──────────────────────────────────────┘

Campo com erro:
┌──────────────────────────────────────┐
│  Nome *                              │
│  ┌────────────────────────────────┐  │
│  │                                │  │ ← borda vermelha
│  └────────────────────────────────┘  │
│  ⚠ Este campo é obrigatório         │
└──────────────────────────────────────┘

Campo válido:
┌──────────────────────────────────────┐
│  Nome * ✓                            │
│  ┌────────────────────────────────┐  │
│  │ João Silva                     │  │ ← borda verde
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

- Arquivo alterado: `src/pages/Onboarding.tsx` (único arquivo)
- Componente `Progress` de `src/components/ui/progress.tsx` será importado
- Nenhuma dependência nova necessária
- Labels dos passos: `["Bem-vindo", "Gênero", "Sobre você", "Fotos", "Interesses", "Valores e fé", "Verificação"]`

