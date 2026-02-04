# 🚜 Sistema de Checklist de Empilhadeiras - Frontend

![Angular](https://img.shields.io/badge/Angular-21.1-DD0031?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Material](https://img.shields.io/badge/Material-21.1-FF4081?style=flat-square&logo=material-design)
![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=flat-square&logo=reactivex)

Sistema web moderno para gestão de checklists de segurança de empilhadeiras, desenvolvido com Angular 21 e Angular Material. Interface intuitiva e responsiva para operadores realizarem vistorias diárias.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Segurança](#-segurança)
- [API Integration](#-api-integration)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Contribuindo](#-contribuindo)

## 🎯 Visão Geral

O sistema frontend fornece uma interface completa para:
- Autenticação segura com JWT
- Preenchimento de checklists de vistoria
- Seleção de empilhadeiras disponíveis
- Classificação de itens (conformes e impeditivos)
- Validação automática e bloqueio de equipamentos
- Gerenciamento de sessão e logout

## ✨ Funcionalidades

### Autenticação
- ✅ Login com RE (Registro de Empregado) e senha
- ✅ Autenticação via JWT (JSON Web Token)
- ✅ Proteção de rotas com guards
- ✅ Interceptor automático para requisições
- ✅ Logout seguro com limpeza de dados

### Checklist
- ✅ Formulário reativo com validações
- ✅ Seleção de empilhadeira disponível
- ✅ Campos de vistoria (data, hora, turno, horímetro)
- ✅ 5 itens conformes (gotejamento, pneus, garfos, limpeza)
- ✅ 16 itens impeditivos (direção, freios, buzina, extintor, etc.)
- ✅ Status por item (OK / Não Conforme)
- ✅ Campo de observação para cada item
- ✅ Observação geral do checklist
- ✅ Validação de itens impeditivos
- ✅ Alerta de bloqueio automático
- ✅ Feedback visual do resultado

### Interface
- ✅ Design moderno com Angular Material
- ✅ Animação de logo com vídeo
- ✅ Tema customizado (Teal/Pink)
- ✅ Responsivo para desktop e tablet
- ✅ Mensagens de feedback (SnackBar)
- ✅ Indicadores de carregamento
- ✅ Foco automático em campos

## 🏗️ Arquitetura

### Padrão de Componentes Standalone
```
src/app/
├── pages/              # Páginas da aplicação
│   ├── login/         # Tela de autenticação
│   └── checklist/     # Tela principal de vistoria
├── services/          # Serviços de comunicação
│   ├── auth.service.ts
│   ├── checklist.service.ts
│   └── empilhadeira.service.ts
├── guards/            # Proteção de rotas
│   └── auth.guard.ts
├── interceptors/      # Interceptadores HTTP
│   └── jwt.interceptor.ts
├── models/            # Interfaces TypeScript
│   └── api.models.ts
└── app.routes.ts      # Definição de rotas
```

### Fluxo de Autenticação
```
1. Usuário → Login (RE + Senha)
2. Frontend → POST /api/auth/login
3. Backend → Valida credenciais → Gera JWT
4. Frontend → Armazena token + dados do usuário
5. Interceptor → Adiciona token em todas as requisições
6. Backend → Valida token → Autoriza ações
```

### Fluxo do Checklist
```
1. Operador faz login
2. Sistema carrega empilhadeiras disponíveis
3. Operador preenche dados da vistoria
4. Operador avalia cada item (OK/Não Conforme)
5. Sistema valida se há itens impeditivos não conformes
6. Se há impeditivos: alerta de bloqueio automático
7. Frontend envia checklist → Backend processa
8. Backend calcula resultado (APROVADO/REPROVADO)
9. Se REPROVADO: bloqueia empilhadeira automaticamente
10. Frontend exibe resultado e reseta formulário
```

## 🛠️ Tecnologias

### Core
- **Angular 21.1** - Framework principal
- **TypeScript 5.9** - Linguagem
- **RxJS 7.8** - Programação reativa
- **Vite** - Build tool

### UI/UX
- **Angular Material 21.1** - Biblioteca de componentes
- **Material Design** - Design system
- **Lottie Web 5.13** - Animações (preparado)
- **Custom Theme** - Tema Teal/Pink

### Formulários
- **Reactive Forms** - Forms tipados e reativos
- **FormBuilder** - Construção de formulários
- **FormArray** - Arrays dinâmicos de controles
- **Validators** - Validações nativas e customizadas

### Ferramentas
- **Prettier** - Formatação de código
- **Vitest 4.0** - Framework de testes
- **JSDOM 27.1** - DOM para testes
- **Angular CLI 21.1** - CLI oficial

## 📦 Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 11.7.0
- **Backend** rodando em http://localhost:8080

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd login
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o ambiente
```bash
# Verifique se o backend está rodando
curl http://localhost:8080/actuator/health
```

### 4. Execute o projeto
```bash
npm start
```

O aplicativo estará disponível em `http://localhost:4200`

## ⚙️ Configuração

### Variáveis de Ambiente

Edite `src/app/services/*.service.ts` para alterar a URL da API:

```typescript
// auth.service.ts
private readonly API_URL = 'http://localhost:8080/api';

// checklist.service.ts
private readonly API_URL = 'http://localhost:8080/api/checklists';

// empilhadeira.service.ts
private readonly API_URL = 'http://localhost:8080/api/empilhadeiras';
```

### Tema Material

Personalize o tema em `src/material-theme.scss`:

```scss
$theme: mat.define-theme(
  (
    color: (
      theme-type: light,
      primary: mat.$teal-palette,
      tertiary: mat.$pink-palette,
    ),
  )
);
```

### Formatação de Código

Configurado no `package.json`:

```json
"prettier": {
  "printWidth": 100,
  "singleQuote": true,
  "overrides": [
    {
      "files": "*.html",
      "options": { "parser": "angular" }
    }
  ]
}
```

## 💻 Uso

### Login

**Credenciais de teste:**

| RE | Nome | Senha | Perfil |
|----|------|-------|--------|
| ADMIN001 | Administrador do Sistema | admin123 | ADMIN |
| SUP001 | Supervisor Logística | super123 | SUPERVISOR |
| OP001 | João da Silva | oper123 | OPERADOR |

### Criando um Checklist

1. Faça login com um operador
2. Selecione a empilhadeira
3. Preencha data, hora e turno
4. Informe o horímetro inicial
5. Avalie cada item como OK ou Não Conforme
6. Adicione observações se necessário
7. Clique em "Salvar Checklist"

### Itens do Checklist

**Conformes (5):**
- Gotejamento
- Pneus dianteiro
- Pneus traseiro
- Garfos
- Limpeza

**Impeditivos (16):**
- Direção
- Cinto de segurança
- Extintor de incêndio
- Buzina
- Vazamento
- Freio pedal
- Freio de estacionário
- Espelho retrovisor
- Sirene de ré
- Iluminação ou sinalização
- Pinos da patola
- Painel ou alavancas inoperante
- Giroflex
- Fixação do cilindro de GLP ineficiente
- Nível do óleo do motor
- Água do radiador

⚠️ **Importante:** Se algum item impeditivo estiver **Não Conforme**, a empilhadeira será **bloqueada automaticamente**.

## 📁 Estrutura do Projeto

```
login/
├── public/                    # Arquivos estáticos
│   ├── favicon.ico
│   ├── logo/                  # Vídeos e imagens
│   │   ├── 0127.webm
│   │   ├── criada.webm
│   │   ├── deicmar.gif
│   │   └── outro.webm
│   └── marcelo.png
├── src/
│   ├── app/
│   │   ├── guards/
│   │   │   └── auth.guard.ts           # Proteção de rotas
│   │   ├── interceptors/
│   │   │   └── jwt.interceptor.ts      # Adiciona JWT nas requisições
│   │   ├── models/
│   │   │   └── api.models.ts           # Interfaces TypeScript
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   │   ├── login.ts            # Componente de login
│   │   │   │   ├── login.html          # Template
│   │   │   │   └── login.css           # Estilos
│   │   │   └── checklist/
│   │   │       ├── checklist.ts        # Componente principal
│   │   │       ├── checklist.html      # Template do formulário
│   │   │       └── checklist.css       # Estilos
│   │   ├── services/
│   │   │   ├── auth.service.ts         # Autenticação
│   │   │   ├── checklist.service.ts    # CRUD de checklists
│   │   │   └── empilhadeira.service.ts # CRUD de empilhadeiras
│   │   ├── app.config.ts               # Configuração do app
│   │   ├── app.routes.ts               # Definição de rotas
│   │   ├── app.ts                      # Componente raiz
│   │   ├── app.html                    # Template raiz
│   │   └── app.css                     # Estilos globais
│   ├── index.html                      # HTML principal
│   ├── main.ts                         # Bootstrap da aplicação
│   ├── material-theme.scss             # Tema Material customizado
│   └── styles.css                      # Estilos globais
├── angular.json                        # Configuração Angular
├── package.json                        # Dependências
├── tsconfig.json                       # Configuração TypeScript
├── GUIA_INTEGRACAO.md                 # Guia de integração frontend+backend
└── README.md                          # Este arquivo
```

## 🔒 Segurança

### JWT (JSON Web Token)

**Fluxo:**
1. Login bem-sucedido retorna token JWT
2. Token armazenado no `localStorage`
3. Interceptor adiciona token automaticamente: `Authorization: Bearer {token}`
4. Backend valida token em cada requisição
5. Token expira em 24 horas

**Implementação:**

```typescript
// jwt.interceptor.ts
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(req);
};
```

### Guards

```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

### Rotas Protegidas

```typescript
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'checklist', 
    component: Checklist, 
    canActivate: [authGuard]  // 🔒 Rota protegida
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
```

## 🔌 API Integration

### Endpoints Utilizados

#### Autenticação
```typescript
POST /api/auth/login
Body: { re: string, senha: string }
Response: { token, tipo, usuarioId, re, nomeCompleto, perfil }
```

#### Empilhadeiras
```typescript
GET /api/empilhadeiras/disponiveis
Headers: { Authorization: Bearer {token} }
Response: EmpilhadeiraResponse[]
```

#### Checklists
```typescript
POST /api/checklists
Headers: { Authorization: Bearer {token} }
Body: ChecklistRequest
Response: ChecklistResponse

GET /api/checklists
GET /api/checklists/{id}
GET /api/checklists/empilhadeira/{empilhadeiraId}
GET /api/checklists/operador/{operadorId}
GET /api/checklists/data/{data}
GET /api/checklists/periodo?dataInicio={date}&dataFim={date}
```

### Modelos de Dados

#### LoginRequest
```typescript
interface LoginRequest {
  re: string;
  senha: string;
}
```

#### ChecklistRequest
```typescript
interface ChecklistRequest {
  data: string;              // YYYY-MM-DD
  horaVistoria: string;      // HH:mm:ss
  turno: 'A' | 'B' | 'C';
  horimetroInicial: number;
  horimetroFinal?: number;
  operadorId: number;
  empilhadeiraId: number;
  itens: ItemChecklistRequest[];
  observacaoGeral?: string;
}
```

#### ItemChecklistRequest
```typescript
interface ItemChecklistRequest {
  descricao: string;
  tipo: 'CONFORME' | 'IMPEDITIVO';
  status: 'OK' | 'NAO_CONFORME';
  observacao?: string;
}
```

### Tratamento de Erros

```typescript
this.checklistService.criar(request).subscribe({
  next: (response) => {
    // Sucesso
    if (response.resultado === 'REPROVADO') {
      this.snackBar.open('🚫 Checklist REPROVADO! Empilhadeira bloqueada.');
    } else {
      this.snackBar.open('✅ Checklist salvo com sucesso!');
    }
  },
  error: (error) => {
    // Erro
    const mensagem = error.error?.message || 'Erro ao salvar checklist';
    this.snackBar.open(`❌ ${mensagem}`, 'Fechar');
  }
});
```

## 🧪 Testes

### Executar testes
```bash
npm test
```

### Estrutura de testes
```
src/app/
├── pages/
│   ├── login/
│   │   └── login.spec.ts
│   └── checklist/
│       └── checklist.spec.ts
└── app.spec.ts
```

### Exemplo de teste
```typescript
describe('LoginComponent', () => {
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate required fields', () => {
    component.loginForm.patchValue({ re: '', senha: '' });
    expect(component.loginForm.invalid).toBe(true);
  });
});
```

## 📦 Deploy

### Build de Produção
```bash
npm run build
```

Os arquivos compilados estarão em `dist/login/browser/`

### Deploy em Servidor Web

**Nginx:**
```nginx
server {
    listen 80;
    server_name exemplo.com;
    root /var/www/login/dist/login/browser;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache:**
```apache
<VirtualHost *:80>
    ServerName exemplo.com
    DocumentRoot /var/www/login/dist/login/browser

    <Directory /var/www/login/dist/login/browser>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

### Variáveis de Ambiente para Produção

Crie um arquivo `environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.exemplo.com/api'
};
```

E use-o nos services:
```typescript
import { environment } from '../environments/environment';

private readonly API_URL = environment.apiUrl;
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use **Prettier** para formatação
- Siga o **Angular Style Guide**
- Escreva testes para novas features
- Documente funções públicas com JSDoc

## 📄 Scripts Disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run build      # Build de produção
npm test           # Executa os testes
npm run watch      # Build com watch mode
```

## 🐛 Troubleshooting

### Erro de CORS
- Certifique-se que o backend está configurado para permitir `http://localhost:4200`
- Verifique `SecurityConfig.java` no backend

### Erro 401 (Não Autorizado)
- Token expirado → Faça login novamente
- Token inválido → Limpe o localStorage: `localStorage.clear()`

### Empilhadeiras não aparecem
- Verifique se o backend está rodando
- Verifique se há empilhadeiras ativas e não bloqueadas no banco

### Erro ao salvar checklist
- Valide todos os campos obrigatórios
- Verifique se o token é válido
- Confirme que o operador e empilhadeira existem

## 📚 Documentação Adicional

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [RxJS](https://rxjs.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)


## 📝 Licença

Este projeto é proprietário e confidencial.

---

**Desenvolvido com ❤️ usando Angular 21 e Material Design**

🚜 *Tornando a operação de empilhadeiras mais segura, um checklist por vez.*
