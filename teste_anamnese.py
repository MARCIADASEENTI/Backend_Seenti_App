import requests
import json

# URL base
BASE_URL = "http://127.0.0.1:5000"

def testar_anamnese():
    """Testa a criação de anamnese com a nova estrutura"""
    
    # Primeiro, criar um usuário
    print("1. Criando usuário...")
    usuario_data = {
        "email": "teste.anamnese@exemplo.com",
        "senha": "123456",
        "tipo_usuario": "C"
    }
    
    response = requests.post(f"{BASE_URL}/usuarios", json=usuario_data)
    if response.status_code != 201:
        print(f"Erro ao criar usuário: {response.json()}")
        return
    
    usuario_id = response.json()["usuario_id"]
    print(f"Usuário criado: {usuario_id}")
    
    # Aceitar termos
    print("2. Aceitando termos...")
    termos_data = {
        "usuario_id": usuario_id,
        "consentimento": True
    }
    
    response = requests.post(f"{BASE_URL}/termos_uso", json=termos_data)
    if response.status_code != 200:
        print(f"Erro ao aceitar termos: {response.json()}")
        return
    
    # Criar cliente
    print("3. Criando cliente...")
    cliente_data = {
        "usuario_id": usuario_id,
        "primeiro_nome": "Maria",
        "sobrenome": "Silva",
        "cpf": "11144477735",
        "data_nascimento": "1990-05-15",
        "genero": "Feminino",
        "contato": {
            "telefone": "31987654321"
        },
        "endereco": {
            "rua": "Rua das Flores",
            "numero": "123",
            "bairro": "Centro",
            "cidade": "Belo Horizonte",
            "estado": "MG",
            "cep": "30123-456"
        }
    }
    
    response = requests.post(f"{BASE_URL}/clientes", json=cliente_data)
    if response.status_code != 201:
        print(f"Erro ao criar cliente: {response.json()}")
        return
    
    cliente_id = response.json()["cliente_id"]
    print(f"Cliente criado: {cliente_id}")
    
    # Criar anamnese com a nova estrutura
    print("4. Criando anamnese...")
    anamnese_data = {
        "cliente_id": cliente_id,
        "dados": {
            "objetivo": "Relaxamento e alívio lombar",
            "area_enfase": "Coluna lombar e ombros",
            "dor_atual": "Sim, lombar direita irradiando para perna",
            "funcionamento_intestinal": "normal",
            "anticoncepcional": "Sim",
            "alimentacao": "Equilibrada, com frutas e vegetais",
            "stress_diario": "alto",
            "enxaqueca": True,
            "depressao": False,
            "insonia": True,
            "dor_mandibula": False,
            "bruxismo": False,
            "disturbio_renal": False,
            "antecedente_oncologico": False,
            "pedra_rim": False,
            "pedra_vesicula": False,
            "doenca_cronica": False,
            "observacoes_saude": "Tratamento recente para ansiedade leve",
            "nao_gosta_massagem_em": "Barriga",
            "email": "maria.silva@exemplo.com",
            "whatsapp": "(31) 98765-4321"
        }
    }
    
    response = requests.post(f"{BASE_URL}/anamneses", json=anamnese_data)
    print(f"Status: {response.status_code}")
    print(f"Resposta: {response.json()}")
    
    if response.status_code == 201:
        anamnese_id = response.json()["anamnese_id"]
        print(f"✅ Anamnese criada com sucesso: {anamnese_id}")
        
        # Buscar anamnese criada
        print("5. Buscando anamnese criada...")
        response = requests.get(f"{BASE_URL}/anamneses/cliente/{cliente_id}")
        if response.status_code == 200:
            anamneses = response.json()
            print(f"Anamneses encontradas: {len(anamneses)}")
            for anamnese in anamneses:
                print(f"ID: {anamnese['_id']}")
                print(f"Data: {anamnese['data_envio']}")
                print(f"Dados: {json.dumps(anamnese['dados'], indent=2, ensure_ascii=False)}")
    else:
        print("❌ Erro ao criar anamnese")

if __name__ == "__main__":
    testar_anamnese() 