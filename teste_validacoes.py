"""
SCRIPT DE TESTE DAS VALIDAÇÕES - SEENTI
Testa as validações implementadas no backend
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def testar_cadastro_usuario():
    """Testa cadastro de usuário"""
    print("🧪 Testando cadastro de usuário...")
    
    dados = {
        "email": "teste@teste.com",
        "senha": "12345678",
        "tipo_usuario": "C",
        "tenant_id": "686af5e0bb776faa73fa8e03"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/usuarios", json=dados)
        print(f"  Status: {response.status_code}")
        print(f"  Resposta: {response.json()}")
        
        if response.status_code == 201:
            return response.json().get("usuario_id")
        return None
    except Exception as e:
        print(f"  Erro: {e}")
        return None

def testar_login(usuario_id):
    """Testa login"""
    print("🧪 Testando login...")
    
    dados = {
        "email": "teste@teste.com",
        "senha": "12345678"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/login", json=dados)
        print(f"  Status: {response.status_code}")
        print(f"  Resposta: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"  Erro: {e}")
        return False

def testar_aceite_termo(usuario_id):
    """Testa aceite de termo"""
    print("🧪 Testando aceite de termo...")
    
    dados = {
        "usuario_id": usuario_id,
        "consentimento": True
    }
    
    try:
        response = requests.post(f"{BASE_URL}/termos_uso", json=dados)
        print(f"  Status: {response.status_code}")
        print(f"  Resposta: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"  Erro: {e}")
        return False

def testar_cadastro_cliente_valido(usuario_id):
    """Testa cadastro de cliente com dados válidos"""
    print("🧪 Testando cadastro de cliente (válido)...")
    
    dados = {
        "usuario_id": usuario_id,
        "primeiro_nome": "João",
        "sobrenome": "Silva",
        "nome_social": "João",
        "cpf": "52998224725",  # CPF válido
        "data_nascimento": "1990-01-01",
        "telefone": "11999999999",
        "genero": "Masculino",
        "tenant_id": "686af5e0bb776faa73fa8e03"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/clientes", json=dados)
        print(f"  Status: {response.status_code}")
        print(f"  Resposta: {response.json()}")
        
        if response.status_code == 201:
            return response.json().get("cliente_id")
        return None
    except Exception as e:
        print(f"  Erro: {e}")
        return None

def testar_cadastro_cliente_cpf_invalido(usuario_id):
    """Testa cadastro de cliente com CPF inválido"""
    print("🧪 Testando cadastro de cliente (CPF inválido)...")
    
    dados = {
        "usuario_id": usuario_id,
        "primeiro_nome": "Maria",
        "sobrenome": "Santos",
        "cpf": "12345678900",  # CPF inválido
        "data_nascimento": "1990-01-01",
        "telefone": "11999999999",
        "tenant_id": "686af5e0bb776faa73fa8e03"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/clientes", json=dados)
        print(f"  Status: {response.status_code}")
        print(f"  Resposta: {response.json()}")
        return response.status_code == 400
    except Exception as e:
        print(f"  Erro: {e}")
        return False

def testar_cadastro_cliente_idade_invalida(usuario_id):
    """Testa cadastro de cliente com idade inválida"""
    print("🧪 Testando cadastro de cliente (idade inválida)...")
    
    dados = {
        "usuario_id": usuario_id,
        "primeiro_nome": "Pedro",
        "sobrenome": "Oliveira",
        "cpf": "12345678909",  # CPF válido
        "data_nascimento": "2010-01-01",  # Menor de 18 anos
        "telefone": "11999999999",
        "tenant_id": "686af5e0bb776faa73fa8e03"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/clientes", json=dados)
        print(f"  Status: {response.status_code}")
        print(f"  Resposta: {response.json()}")
        return response.status_code == 400
    except Exception as e:
        print(f"  Erro: {e}")
        return False

def main():
    """Executa todos os testes"""
    print("🚀 INICIANDO TESTES DE VALIDAÇÃO")
    print("=" * 50)
    
    # Teste 1: Cadastro de usuário
    usuario_id = testar_cadastro_usuario()
    if not usuario_id:
        print("❌ Falha no cadastro de usuário")
        return
    
    print()
    
    # Teste 2: Login
    if not testar_login(usuario_id):
        print("❌ Falha no login")
        return
    
    print()
    
    # Teste 3: Aceite de termo
    if not testar_aceite_termo(usuario_id):
        print("❌ Falha no aceite de termo")
        return
    
    print()
    
    # Teste 4: Cadastro de cliente válido
    cliente_id = testar_cadastro_cliente_valido(usuario_id)
    if not cliente_id:
        print("❌ Falha no cadastro de cliente válido")
        return
    
    print()
    
    # Teste 5: Cadastro com CPF inválido
    if not testar_cadastro_cliente_cpf_invalido(usuario_id):
        print("❌ Falha na validação de CPF inválido")
        return
    
    print()
    
    # Teste 6: Cadastro com idade inválida
    if not testar_cadastro_cliente_idade_invalida(usuario_id):
        print("❌ Falha na validação de idade")
        return
    
    print()
    print("✅ TODOS OS TESTES PASSARAM!")
    print("🎯 As validações estão funcionando corretamente")

if __name__ == "__main__":
    main() 