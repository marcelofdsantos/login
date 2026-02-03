# 🔗 Guia de Integração Frontend + Backend

## Sistema Completo de Checklist de Empilhadeiras

Este guia mostra como executar o sistema completo com frontend Angular e backend Spring Boot.

---

## 📦 Componentes do Sistema

### Backend (Java/Spring Boot)
- **Localização**: `checklist-empilhadeira/`
- **Porta**: 8080
- **Tecnologias**: Java 17, Spring Boot, H2 Database, JWT

### Frontend (Angular)
- **Localização**: `login/`
- **Porta**: 4200
- **Tecnologias**: Angular 21, TypeScript, Angular Material

---

## 🚀 Executando o Sistema Completo

### Passo 1: Iniciar o Backend

```bash
# Entre na pasta do backend
cd checklist-empilhadeira

# Execute com Maven (ou pelo IntelliJ)
./mvnw spring-boot:run

# Ou se estiver no Windows:
mvnw.cmd spring-boot:run
```

**Aguarde até ver**:
```
Tomcat started on port(s): 8080 (http)
Started ChecklistEmpilhadeiraApplication in X.XXX seconds
```

✅ Backend rodando em: `http://localhost:8080`

### Passo 2: Iniciar o Frontend

```bash
# Em outro terminal, entre na pasta do frontend
cd login

# Instale as dependências (primeira vez apenas)
npm install

# Execute o servidor de desenvolvimento
npm start
```

**Aguarde até ver**:
```
✔ Browser application bundle generation complete.
Local: http://localhost:4200/
```

✅ Frontend rodando em: `http://localhost:4200`

### Passo 3: Acessar o Sistema

1. Abra o navegador em: `http://localhost:4200`
2. Faça login com:
   - **RE**: OP001
   - **Senha**: oper123
3. Preencha o checklist

---

## 🔐 Credenciais de Teste

| RE | Nome | Senha | Perfil |
|----|------|-------|--------|
| ADMIN001 | Administrador do Sistema | admin123 | ADMIN |
| SUP001 | Supervisor Logística | super123 | SUPERVISOR |
| OP001 | João da Silva | oper123 | OPERADOR |

---

## 📊 Fluxo Completo de Teste

### Teste 1: Checklist APROVADO ✅

1. **Login** como OP001
2. **Selecione** empilhadeira "Toyota 8FGU25"
3. **Preencha** todos os dados da vistoria
4. **Marque TODOS os itens como OK**
5. **Salve**

**Resultado**: 
- ✅ Checklist APROVADO
- ✅ Empilhadeira LIBERADA

### Teste 2: Checklist REPROVADO 🚫

1. **Login** como OP001
2. **Selecione** empilhadeira "Hyster H3.0FT"
3. **Preencha** os dados
4. **Marque** "Freio pedal" como **NÃO CONFORME**
5. **Adicione observação**: "Freio com folga"
6. **Salve**

**Resultado**: 
- ❌ Checklist REPROVADO
- 🚫 Empilhadeira BLOQUEADA automaticamente

### Teste 3: Verificar Bloqueio

1. **Tente** criar novo checklist
2. **Observe** que a empilhadeira bloqueada não aparece mais na lista

### Teste 4: Desbloquear (Supervisor)

1. **Logout**
2. **Login** como SUP001 (supervisor)
3. **Use Postman/Insomnia** para desbloquear:

```bash
curl -X PATCH http://localhost:8080/api/empilhadeiras/2/desbloquear \
  -H "Authorization: Bearer {TOKEN_DO_SUPERVISOR}"
```

---

## 🔄 Comunicação Frontend → Backend

### 1. Login
```
[Frontend] POST http://localhost:8080/api/auth/login
           Body: { "re": "OP001", "senha": "oper123" }

[Backend]  Valida credenciais
           Gera token JWT
           
[Frontend] Recebe: { "token": "eyJhbG...", "nomeCompleto": "João da Silva", ... }
           Armazena token no localStorage
```

### 2. Carregar Empilhadeiras
```
[Frontend] GET http://localhost:8080/api/empilhadeiras/disponiveis
           Header: Authorization: Bearer {token}

[Backend]  Valida token JWT
           Retorna lista de empilhadeiras não bloqueadas
           
[Frontend] Exibe no dropdown de seleção
```

### 3. Salvar Checklist
```
[Frontend] POST http://localhost:8080/api/checklists
           Header: Authorization: Bearer {token}
           Body: {
             "data": "2024-01-28",
             "turno": "A",
             "empilhadeiraId": 1,
             "operadorId": 3,
             "itens": [...]
           }

[Backend]  Valida token
           Valida dados
           Calcula resultado (APROVADO/REPROVADO)
           Se REPROVADO → bloqueia empilhadeira
           Salva no banco
           
[Frontend] Recebe confirmação
           Exibe mensagem de sucesso/erro
```

---

## 🛠️ Arquitetura de Segurança

### JWT (JSON Web Token)

1. **Login**: Usuário envia RE + senha
2. **Token**: Backend gera token JWT válido por 24h
3. **Storage**: Frontend armazena no localStorage
4. **Interceptor**: Adiciona token em todas as requisições
5. **Backend**: Valida token em cada request
6. **Expiração**: Após 24h, usuário precisa fazer login novamente

### Fluxo de Autorização

```
[Frontend] → Request com token
           ↓
[JwtInterceptor] → Adiciona header "Authorization: Bearer {token}"
           ↓
[Backend: JwtAuthenticationFilter] → Valida token
           ↓
[Backend: SecurityConfig] → Verifica permissões (OPERADOR/SUPERVISOR/ADMIN)
           ↓
[Controller] → Executa ação se autorizado
```

---

## 🗄️ Banco de Dados

### Acesso ao H2 Console

1. Acesse: `http://localhost:8080/h2-console`
2. Configure:
   - **JDBC URL**: `jdbc:h2:mem:checklistdb`
   - **Username**: `sa`
   - **Password**: (vazio)
3. Clique em "Connect"

### Consultas Úteis

```sql
-- Ver todos os usuários
SELECT * FROM usuarios;

-- Ver todas as empilhadeiras
SELECT * FROM empilhadeiras;

-- Ver empilhadeiras bloqueadas
SELECT * FROM empilhadeiras WHERE bloqueada = TRUE;

-- Ver todos os checklists
SELECT * FROM checklists ORDER BY data_criacao DESC;

-- Ver checklists reprovados
SELECT * FROM checklists WHERE resultado = 'REPROVADO';

-- Ver itens de um checklist específico
SELECT * FROM itens_checklist WHERE checklist_id = 1;
```

---

## 🐛 Troubleshooting

### Backend não inicia
- ✅ Verifique se tem Java 17 instalado: `java -version`
- ✅ Verifique se a porta 8080 está livre
- ✅ Limpe o projeto: `mvn clean install`

### Frontend não inicia
- ✅ Verifique Node.js: `node --version` (precisa ser 18+)
- ✅ Reinstale dependências: `rm -rf node_modules && npm install`
- ✅ Verifique se a porta 4200 está livre

### Erro de CORS
- ✅ Certifique-se que o backend está rodando
- ✅ Verifique `SecurityConfig.java` → `corsConfigurationSource()`
- ✅ Deve permitir origem `http://localhost:4200`

### Erro 401 (Não Autorizado)
- ✅ Token expirou → Faça login novamente
- ✅ Token inválido → Limpe localStorage e faça login
- ✅ Credenciais erradas → Verifique RE e senha

### Erro 403 (Proibido)
- ✅ Usuário não tem permissão para a ação
- ✅ Exemplo: OPERADOR não pode desbloquear empilhadeiras (precisa ser SUPERVISOR ou ADMIN)

### Empilhadeiras não aparecem
- ✅ Verifique se há empilhadeiras cadastradas
- ✅ Verifique se não estão todas bloqueadas
- ✅ Use o H2 Console para verificar: `SELECT * FROM empilhadeiras WHERE bloqueada = FALSE AND ativa = TRUE;`

---

## 📝 Próximos Passos

### Funcionalidades Extras

1. **Dashboard para Supervisor**
   - Ver histórico de checklists
   - Empilhadeiras bloqueadas
   - Estatísticas

2. **Relatórios**
   - Exportar checklists em PDF
   - Gráficos de conformidade

3. **Notificações**
   - Email quando empilhadeira bloqueia
   - Push notifications

4. **Fotos**
   - Upload de fotos dos problemas encontrados

---

## ✅ Checklist de Verificação

Antes de considerar o sistema pronto, verifique:

- [ ] Backend roda sem erros
- [ ] Frontend roda sem erros
- [ ] Login funciona com todas as credenciais
- [ ] Consegue listar empilhadeiras disponíveis
- [ ] Consegue criar checklist com todos itens OK
- [ ] Consegue criar checklist com item impeditivo não conforme
- [ ] Empilhadeira é bloqueada automaticamente
- [ ] Empilhadeira bloqueada não aparece na lista
- [ ] Supervisor consegue desbloquear (via API)
- [ ] Dados são salvos no banco H2
- [ ] Token JWT funciona
- [ ] Logout funciona

---

## 🎉 Sistema Completo!

Agora você tem um sistema full-stack funcional de checklist de empilhadeiras!

**Frontend**: Angular 21 + Material Design
**Backend**: Java 21 + Spring Boot + JWT
**Banco**: H2 (dev) / PostgreSQL (prod)

---

**Dúvidas? Consulte os READMEs específicos em cada pasta do projeto!** 📚
