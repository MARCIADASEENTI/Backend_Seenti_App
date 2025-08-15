#!/usr/bin/env python3
"""
Script de teste para verificar validação de CPF duplicado
"""

import requests
import json

# Configurações
BASE_URL = "http://127.0.0.1:5000"
CPF_TESTE = "97060968687"  # CPF que já existe na base

def testar_cpf_duplicado():
    """Testa se a validação de CPF duplicado está funcionando"""
    
    print("🧪 TESTE DE VALIDAÇÃO DE CPF DUPLICADO")
    print("=" * 50)
    
    # Dados de teste
    dados_teste = {
        "usuario_id": "507f1f77bcf86cd799439011",  # ID fictício para teste
        "primeiro_nome": "TESTE",
        "sobrenome": "CPF DUPLICADO",
        "cpf": CPF_TESTE,
        "data_nascimento": "1990-01-01",
        "telefone": "11999999999",
        "endereco": {
            "rua": "Rua Teste",
            "numero": "123",
            "bairro": "Centro",
            "cidade": "São Paulo",
            "estado": "SP",
            "cep": "01234-567"
        }
    }
    
    print(f"📝 Dados de teste:")
    print(f"   CPF: {CPF_TESTE}")
    print(f"   Nome: {dados_teste['primeiro_nome']} {dados_teste['sobrenome']}")
    print()
    
    try:
        # Fazer requisição POST para /clientes
        print("🚀 Enviando requisição POST para /clientes...")
        response = requests.post(
            f"{BASE_URL}/clientes",
            json=dados_teste,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"📊 Resposta recebida:")
        print(f"   Status: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        
        if response.text:
            try:
                response_data = response.json()
                print(f"   Dados: {json.dumps(response_data, indent=2, ensure_ascii=False)}")
            except:
                print(f"   Texto: {response.text}")
        
        print()
        
        # Verificar se a validação funcionou
        if response.status_code == 409:
            print("✅ SUCESSO: Validação de CPF duplicado funcionando!")
            print("   - Status 409 retornado corretamente")
            print("   - CPF duplicado foi rejeitado")
        elif response.status_code == 201:
            print("❌ PROBLEMA: CPF duplicado foi aceito!")
            print("   - Status 201 retornado (deveria ser 409)")
            print("   - Validação de CPF duplicado não está funcionando")
        else:
            print(f"⚠️  STATUS INESPERADO: {response.status_code}")
            print("   - Verificar logs do backend para entender o que aconteceu")
            
    except requests.exceptions.ConnectionError:
        print("❌ ERRO: Não foi possível conectar ao backend")
        print("   - Verifique se o servidor está rodando em http://127.0.0.1:5000")
    except Exception as e:
        print(f"❌ ERRO INESPERADO: {str(e)}")

def verificar_cpf_na_base():
    """Verifica se o CPF de teste existe na base"""
    
    print("\n🔍 VERIFICANDO CPF NA BASE DE DADOS")
    print("=" * 50)
    
    try:
        # Buscar cliente por CPF (endpoint que precisamos criar)
        print("🔍 Buscando cliente por CPF...")
        
        # Como não temos endpoint para buscar por CPF, vamos listar todos os clientes
        # (isso é apenas para teste, não usar em produção)
        response = requests.get(f"{BASE_URL}/clientes")
        
        if response.status_code == 200:
            clientes = response.json()
            print(f"📊 Total de clientes na base: {len(clientes)}")
            
            # Procurar pelo CPF de teste
            cpf_encontrado = False
            for cliente in clientes:
                if cliente.get('cpf') == CPF_TESTE:
                    cpf_encontrado = True
                    print(f"✅ CPF {CPF_TESTE} encontrado na base!")
                    print(f"   Cliente: {cliente.get('primeiro_nome')} {cliente.get('sobrenome')}")
                    break
            
            if not cpf_encontrado:
                print(f"❌ CPF {CPF_TESTE} NÃO encontrado na base")
                print("   - Isso pode explicar por que a validação não está funcionando")
        else:
            print(f"❌ Erro ao buscar clientes: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erro ao verificar base: {str(e)}")

if __name__ == "__main__":
    print("🚀 INICIANDO TESTES DE VALIDAÇÃO DE CPF")
    print("=" * 60)
    
    # Verificar se o backend está rodando
    try:
        response = requests.get(f"{BASE_URL}/")
        print("✅ Backend está rodando")
    except:
        print("❌ Backend não está rodando")
        print("   - Execute: cd SeentiCliente/dev && python3 app.py")
        exit(1)
    
    # Executar testes
    testar_cpf_duplicado()
    verificar_cpf_na_base()
    
    print("\n🏁 TESTES CONCLUÍDOS")
    print("=" * 60)
