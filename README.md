# Wayne Enterprises - Sistema de Gestão

Sistema de gestão desenvolvido para a Wayne Enterprises, com foco em gerenciamento de veículos, equipamentos e dispositivos de segurança.

## 🦇 Características

- Design inspirado no tema Batman
- Interface dark mode
- Gestão de veículos
- Gestão de equipamentos
- Gestão de dispositivos
- Sistema de autenticação
- Dashboard interativo

## 🚀 Tecnologias

### Backend
- Python 3.8+
- Django 4.2
- Django REST Framework
- Django Knox (Autenticação)
- SQLite (Banco de dados)

### Frontend
- React 18
- Material-UI (MUI)
- Redux Toolkit
- React Router
- Axios

## ⚙️ Instalação

### Backend

1. Entre na pasta do backend:
```bash
cd backend
```

2. Crie um ambiente virtual:
```bash
python -m venv venv
```

3. Ative o ambiente virtual:
```bash
# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate
```

4. Instale as dependências:
```bash
pip install -r requirements.txt
```

5. Execute as migrações:
```bash
python manage.py migrate
```

6. Crie um superusuário (opcional):
```bash
python manage.py createsuperuser
```

### Frontend

1. Entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

## 🏃‍♂️ Executando o Projeto

### Backend

1. Ative o ambiente virtual (se não estiver ativo):
```bash
source venv/bin/activate  # Linux/macOS
# ou
venv\Scripts\activate     # Windows
```

2. Execute o servidor:
```bash
cd backend
python manage.py runserver
```
O backend estará disponível em `http://localhost:8000`

### Frontend

1. Em outro terminal, execute:
```bash
cd frontend
npm start
```
O frontend estará disponível em `http://localhost:3000`

## 🔒 Autenticação

- Use o endpoint `/api/auth/register/` para criar um novo usuário
- Use o endpoint `/api/auth/login/` para fazer login
- Tokens são gerenciados automaticamente pelo frontend

## 📱 Endpoints Principais

### Autenticação
- POST `/api/auth/register/` - Registro de usuário
- POST `/api/auth/login/` - Login
- POST `/api/auth/logout/` - Logout
- GET `/api/auth/user/` - Dados do usuário atual

### Recursos
- `/api/vehicles/` - Gestão de veículos
- `/api/equipment/` - Gestão de equipamentos
- `/api/devices/` - Gestão de dispositivos
- `/api/security/` - Gestão de segurança
- `/api/dashboard/` - Dados do dashboard
