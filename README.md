# Y-CSV

Editor de arquivos CSV baseado em navegador, construído com React e Vite. O Y-CSV permite importar, visualizar, editar e gerenciar arquivos CSV diretamente no navegador, com persistência local via IndexedDB — sem depender de um back-end para manter os dados entre sessões.

## ✨ Funcionalidades

- **Importação de arquivos CSV** — carregue arquivos `.csv` diretamente no navegador para visualização e edição.
- **Edição em tabela** — visualize e edite os dados em formato de planilha, com atualização em tempo real.
- **Persistência local (armazenamento offline)** — os dados são salvos localmente via IndexedDB (usando `localforage`), permitindo que o trabalho seja mantido entre sessões sem precisar reenviar o arquivo.
- **Arquitetura de armazenamento em chunks** — arquivos grandes são armazenados em blocos (chunks), otimizando performance e uso de memória ao lidar com datasets maiores.
- **Navegação em múltiplas telas** — roteamento entre páginas/views da aplicação usando `react-router-dom`.
- **Interface com ícones modernos** — uso da biblioteca `lucide-react` para uma UI limpa e consistente.
- **Exportação de dados** — possibilidade de exportar os dados editados de volta para CSV.

> Algumas funcionalidades podem variar conforme a evolução do projeto — consulte o código-fonte em `src/` para o estado mais atualizado.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| [React 19](https://react.dev/) | Biblioteca principal para construção da interface |
| [Vite](https://vitejs.dev/) | Bundler e servidor de desenvolvimento |
| [React Router DOM](https://reactrouter.com/) | Roteamento entre páginas da aplicação |
| [localforage](https://github.com/localForage/localForage) | Armazenamento offline assíncrono (IndexedDB) para persistência dos dados CSV |
| [lucide-react](https://lucide.dev/) | Ícones SVG para a interface |
| [ESLint](https://eslint.org/) | Padronização e qualidade de código |

## 🚀 Como executar localmente

Pré-requisitos: [Node.js](https://nodejs.org/) instalado.

```bash
# Clone o repositório
git clone https://github.com/yannickcruz/Y-CSV.git
cd Y-CSV

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (porta padrão do Vite).

### Outros scripts disponíveis

```bash
npm run build     # Gera a versão de produção (pasta dist/)
npm run preview   # Executa uma prévia local do build de produção
npm run lint      # Roda o ESLint no projeto
```

## 📁 Estrutura do projeto

```
Y-CSV/
├── public/          # Arquivos estáticos
├── src/             # Código-fonte da aplicação (componentes, páginas, lógica de storage)
├── index.html        # Ponto de entrada HTML
├── vite.config.js    # Configuração do Vite
├── eslint.config.js  # Configuração do ESLint
└── package.json      # Dependências e scripts
```
