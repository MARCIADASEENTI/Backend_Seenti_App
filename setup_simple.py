"""
SETUP SIMPLIFICADO DO BANCO DE DADOS - SEENTI
Versão compatível com Python 3.10
"""

import os
from datetime import datetime
from pymongo import MongoClient, ASCENDING
from bson import ObjectId

# Configuração da conexão
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://App_mdb:nJkn86qjYvUjlwpJ@ps-terapia.8dgyy1d.mongodb.net/seenti_db")
client = MongoClient(MONGO_URI)
db = client["seenti_db"]

def criar_indices():
    """Cria todos os índices necessários"""
    print("🔧 Criando índices...")
    
    indices_config = {
        "usuarios": [
            [("email", ASCENDING), ("tenant_id", ASCENDING)],  # único por tenant
            [("tenant_id", ASCENDING)],
            [("tipo_usuario", ASCENDING)]
        ],
        "clientes": [
            [("cpf", ASCENDING), ("tenant_id", ASCENDING)],  # único por tenant
            [("usuario_id", ASCENDING)],  # único
            [("tenant_id", ASCENDING)]
        ],
        "anamneses": [
            [("cliente_id", ASCENDING)],  # único por cliente
            [("tenant_id", ASCENDING)],
            [("status", ASCENDING)]
        ],
        "tenants": [
            [("codigo", ASCENDING)],  # único
            [("cnpj", ASCENDING)]  # único
        ],
        "termos_uso": [
            [("tenant_id", ASCENDING), ("ativo", ASCENDING)],
            [("versao", ASCENDING)]
        ]
    }
    
    for colecao, indices in indices_config.items():
        collection = db[colecao]
        
        for i, indice in enumerate(indices):
            try:
                if len(indice) > 1:
                    # Índice composto
                    collection.create_index(
                        indice,
                        unique=True,
                        name=f"idx_{colecao}_{i}"
                    )
                    print(f"  ✅ Índice único criado: {colecao}.{indice}")
                else:
                    # Índice simples
                    collection.create_index(indice[0], ASCENDING)
                    print(f"  ✅ Índice criado: {colecao}.{indice[0]}")
            except Exception as e:
                print(f"  ⚠️ Erro ao criar índice {colecao}: {e}")

def criar_tenant_padrao():
    """Cria o tenant padrão (Seenti) se não existir"""
    print("🏢 Criando tenant padrão...")
    
    tenants = db["tenants"]
    
    # Verifica se já existe o tenant padrão
    tenant_existente = tenants.find_one({"codigo": "seenti"})
    
    if not tenant_existente:
        tenant_padrao = {
            "_id": ObjectId(),
            "codigo": "seenti",
            "nome": "Seenti",
            "razao_social": "Seenti - Terapias Integrativas",
            "cnpj": "00.000.000/0001-00",  # Placeholder
            "email_contato": "contato@seenti.com.br",
            "telefone": "(11) 99999-9999",
            "endereco": {
                "rua": "Rua Exemplo",
                "numero": "123",
                "bairro": "Centro",
                "cidade": "São Paulo",
                "estado": "SP",
                "cep": "01234-567"
            },
            "configuracoes_visuais": {
                "cores": {
                    "primaria": "#0066cc",
                    "secundaria": "#ffffff",
                    "texto": "#333333",
                    "fundo": "#f4f4f4"
                },
                "logo": {
                    "url": "/assets/logo-seenti.png",
                    "altura": 60,
                    "largura": 200
                },
                "fonte": {
                    "familia": "Inter, sans-serif",
                    "tamanho_base": 16
                },
                "textos": {
                    "nome_plataforma": "Seenti",
                    "slogan": "Terapias Integrativas",
                    "termo_uso": "Termo de Consentimento e Uso - Seenti"
                }
            },
            "ativo": True,
            "data_criacao": datetime.now(),
            "data_atualizacao": datetime.now()
        }
        
        resultado = tenants.insert_one(tenant_padrao)
        print(f"  ✅ Tenant padrão criado: {resultado.inserted_id}")
        return str(resultado.inserted_id)
    else:
        print("  ℹ️ Tenant padrão já existe")
        return str(tenant_existente["_id"])

def criar_termo_padrao(tenant_id):
    """Cria o termo de uso padrão se não existir"""
    print("📜 Criando termo de uso padrão...")
    
    termos = db["termos_uso"]
    
    # Verifica se já existe o termo padrão
    termo_existente = termos.find_one({
        "tenant_id": tenant_id,
        "ativo": True
    })
    
    if not termo_existente:
        termo_padrao = {
            "_id": ObjectId(),
            "tenant_id": tenant_id,
            "versao": "1.0.0",
            "titulo": "Termo de Consentimento e Uso",
            "conteudo": """
TERMO DE CONSENTIMENTO E USO

Este aplicativo coleta dados pessoais e de saúde para viabilizar o atendimento personalizado em Terapias Integrativas.
Ao continuar, você declara estar ciente e de acordo com:

- O uso dos dados para fins de registro clínico, evolução terapêutica e contato.
- O armazenamento seguro das informações, em conformidade com a LGPD.
- A possibilidade de revogar este consentimento a qualquer momento, solicitando a exclusão dos dados.

Em caso de dúvidas, entre em contato com nossa equipe.
            """.strip(),
            "ativo": True,
            "data_criacao": datetime.now(),
            "data_atualizacao": datetime.now()
        }
        
        resultado = termos.insert_one(termo_padrao)
        print(f"  ✅ Termo padrão criado: {resultado.inserted_id}")
    else:
        print("  ℹ️ Termo padrão já existe")

def verificar_estrutura_atual():
    """Verifica a estrutura atual das coleções"""
    print("🔍 Verificando estrutura atual...")
    
    colecoes_esperadas = ["usuarios", "clientes", "anamneses", "termos_uso", "tenants"]
    
    for colecao in colecoes_esperadas:
        if colecao in db.list_collection_names():
            count = db[colecao].count_documents({})
            print(f"  ✅ {colecao}: {count} documentos")
        else:
            print(f"  ❌ {colecao}: coleção não existe")

def main():
    """Executa a configuração completa do banco"""
    print("🚀 INICIANDO CONFIGURAÇÃO DO BANCO DE DADOS SEENTI")
    print("=" * 50)
    
    try:
        # 1. Verificar estrutura atual
        verificar_estrutura_atual()
        print()
        
        # 2. Criar tenant padrão
        tenant_id = criar_tenant_padrao()
        print()
        
        # 3. Criar termo padrão
        criar_termo_padrao(tenant_id)
        print()
        
        # 4. Criar índices
        criar_indices()
        print()
        
        print("✅ CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!")
        print("🎯 O banco está pronto para desenvolvimento")
        print(f"🏢 Tenant ID padrão: {tenant_id}")
        
    except Exception as e:
        print(f"❌ Erro durante a configuração: {e}")
        raise
    finally:
        client.close()

if __name__ == "__main__":
    main() 