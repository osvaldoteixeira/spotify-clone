# Spotify Clone - Guia de Configuração

Este documento contém instruções para configurar e executar o clone do Spotify que foi desenvolvido com Next.js 13, React, Tailwind CSS, Supabase e Stripe.

## Pré-requisitos

- Node.js 16.8.0 ou superior
- npm ou yarn
- Conta no Supabase (gratuita)
- Conta no Stripe (modo teste)

## Configuração do Ambiente

### 1. Instalar Dependências

Após descompactar o projeto, navegue até a pasta raiz e execute:

```bash
npm install
# ou
yarn install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=sua_chave_publicavel_do_stripe
STRIPE_SECRET_KEY=sua_chave_secreta_do_stripe
STRIPE_WEBHOOK_SECRET=seu_segredo_de_webhook_do_stripe
```

### 3. Configurar o Supabase

1. Crie uma nova conta no [Supabase](https://supabase.com) se ainda não tiver uma
2. Crie um novo projeto
3. Copie a URL e a chave anônima para as variáveis de ambiente
4. No SQL Editor, execute os seguintes comandos para criar as tabelas necessárias:

```sql
-- Tabela de usuários estendida
CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  billing_address JSONB,
  payment_method JSONB
);

-- Tabela de produtos
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  active BOOLEAN,
  name TEXT,
  description TEXT,
  image TEXT,
  metadata JSONB
);

-- Tabela de preços
CREATE TABLE prices (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id),
  active BOOLEAN,
  description TEXT,
  unit_amount INTEGER,
  currency TEXT,
  type TEXT,
  interval TEXT,
  interval_count INTEGER,
  trial_period_days INTEGER,
  metadata JSONB
);

-- Tabela de clientes
CREATE TABLE customers (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  stripe_customer_id TEXT
);

-- Tabela de assinaturas
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  status TEXT,
  metadata JSONB,
  price_id TEXT REFERENCES prices(id),
  quantity INTEGER,
  cancel_at_period_end BOOLEAN,
  created TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE
);

-- Tabela de músicas
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  image_path TEXT NOT NULL,
  song_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de músicas curtidas
CREATE TABLE liked_songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  song_id UUID REFERENCES songs(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurar armazenamento
-- Execute no painel do Supabase:
-- 1. Crie um bucket chamado "songs" para armazenar arquivos MP3
-- 2. Crie um bucket chamado "images" para armazenar imagens
-- 3. Configure as políticas de acesso para permitir leitura pública
```

5. Configure a autenticação no Supabase:
   - Habilite o provedor de e-mail/senha
   - Habilite o provedor Google (opcional)
   - Configure os redirecionamentos para seu domínio local (http://localhost:3000)

### 4. Configurar o Stripe

1. Crie uma conta no [Stripe](https://stripe.com) se ainda não tiver uma
2. Obtenha as chaves de API no modo teste
3. Configure um webhook para o endpoint `/api/webhooks/stripe` com os seguintes eventos:
   - product.created
   - product.updated
   - price.created
   - price.updated
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted

## Executando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

Acesse http://localhost:3000 no seu navegador.

## Funcionalidades Implementadas

- **Autenticação**: Login, registro, login social com Google
- **Upload de Músicas**: Upload de arquivos MP3 e imagens de capa
- **Reprodução de Música**: Player completo com controles de volume e navegação
- **Sistema de Curtidas**: Salvar músicas favoritas
- **Assinaturas Premium**: Integração com Stripe para pagamentos recorrentes

## Estrutura do Projeto

- `/src/app`: Páginas e rotas da aplicação
- `/src/app/(site)`: Componentes específicos da interface principal
- `/components`: Componentes reutilizáveis (Sidebar, Box, etc.)
- `/hooks`: Hooks personalizados para gerenciamento de estado
- `/libs`: Utilitários e configurações (Supabase, Stripe)
- `/types`: Definições de tipos TypeScript

## Personalização

Para personalizar o projeto:

1. Modifique os estilos em `globals.css` e nos componentes individuais
2. Atualize os metadados em `layout.tsx` para refletir sua marca
3. Configure produtos e preços no painel do Stripe

## Implantação

Para implantar em produção:

1. Configure um projeto no Vercel ou outro provedor
2. Configure as mesmas variáveis de ambiente no provedor
3. Implante o código-fonte

## Suporte

Se precisar de ajuda, consulte a documentação oficial das tecnologias utilizadas:

- [Next.js](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Stripe](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
