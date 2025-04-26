# Introdução

Este é o projeto de desenvolvimento de um website que organize os documentos pertinentes da clínica multidisciplinar em um único ambiente, para a melhor comunicação entre os profissionais que atuam com seus pacientes com deficiência.

## Tecnologias utilizadas

- **Frontend**:
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - React Router
- **Backend**:
  - Supabase (PostgreSQL database + auth)
- **Deployment**:
  - Vercel

# Instalação

1. **Clone o Repositório e Mude o Diretório**

Para desenvolvedores:

Clone o repositório:
```bash
   git clone git@github.com:tatianebalestra/projeto-integrador-iii.git
```
Mude o diretório:
```bash
   cd pi3
```

2. **Instale e Use a versão correta do Node.js**

Primeiro, certifique-se de instalar exatamente a versão do **node.js: v22.14.0**
- [Node.js](https://nodejs.org/) (version 22.14.0)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)

3. **Crie um arquivo a .env na raiz do diretório com as credenciais do Supabase:**

VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

4. **Instale as Dependências do Projeto**

Instale as dependências do projeto e rode localmente o servidor de desenvolvimento:

```bash
npm install

npm run dev
```

Abra o endereço [http://localhost:3000](http://localhost:3000) com o seu browser para ver o resultado.

Você pode começar editando a página modificando o arquivo `src/App.tsx`. A página auto-atualiza à medida que você edita os arquivos.

