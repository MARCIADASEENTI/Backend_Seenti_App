"""
SCRIPT DE CONFIGURAÇÃO DO BANCO DE DADOS - SEENTI
Executa a estruturação completa do banco antes do desenvolvimento
"""

import os
from datetime import datetime
from pymongo import MongoClient, ASCENDING
from bson import ObjectId
from database_schema import INDICES_MONGODB, SchemaTenant, SchemaTermoUso

# Configuração da conexão
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://<usuario>:<senha>@ps-terapia.8dgyy1d.mongodb.net/seenti_db")
client = MongoClient(MONGO_URI)
db = client["seenti_db"]

def criar_indices():
    """Cria todos os índices necessários"""
    print("🔧 Criando índices...")
    
    for colecao, indices in INDICES_MONGODB.items():
        collection = db[colecao]
        
        for indice in indices:
            try:
                if isinstance(indice, dict):
                    # Índice único
                    campos = list(indice.keys())
                    collection.create_index(
                        [(campo, ASCENDING) for campo in campos],
                        unique=True,
                        name=f"idx_{colecao}_{'_'.join(campos)}"
                    )
                    print(f"  ✅ Índice único criado: {colecao}.{campos}")
                else:
                    # Índice simples
                    collection.create_index(indice, ASCENDING)
                    print(f"  ✅ Índice criado: {colecao}.{indice}")
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
    else:
        print("  ℹ️ Tenant padrão já existe")

def criar_termo_padrao():
    """Cria o termo de uso padrão se não existir"""
    print("📜 Criando termo de uso padrão...")
    
    termos = db["termos_uso"]
    tenants = db["tenants"]
    
    # Busca o tenant padrão
    tenant_padrao = tenants.find_one({"codigo": "seenti"})
    
    if not tenant_padrao:
        print("  ❌ Tenant padrão não encontrado. Execute criar_tenant_padrao() primeiro.")
        return
    
    # Verifica se já existe o termo padrão
    termo_existente = termos.find_one({
        "tenant_id": str(tenant_padrao["_id"]),
        "ativo": True
    })
    
    if not termo_existente:
        termo_padrao = {
            "_id": ObjectId(),
            "tenant_id": str(tenant_padrao["_id"]),
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

def limpar_dados_teste():
    """Remove dados de teste (OPCIONAL - usar apenas em desenvolvimento)"""
    print("🧹 Limpando dados de teste...")
    
    colecoes_para_limpar = ["usuarios", "clientes", "anamneses"]
    
    for colecao in colecoes_para_limpar:
        count = db[colecao].count_documents({})
        if count > 0:
            db[colecao].delete_many({})
            print(f"  🗑️ {colecao}: {count} documentos removidos")
        else:
            print(f"  ℹ️ {colecao}: já está vazia")

def main():
    """Executa a configuração completa do banco"""
    print("🚀 INICIANDO CONFIGURAÇÃO DO BANCO DE DADOS SEENTI")
    print("=" * 50)
    
    try:
        # 1. Verificar estrutura atual
        verificar_estrutura_atual()
        print()
        
        # 2. Criar tenant padrão
        criar_tenant_padrao()
        print()
        
        # 3. Criar termo padrão
        criar_termo_padrao()
        print()
        
        # 4. Criar índices
        criar_indices()
        print()
        
        # 5. Opcional: limpar dados de teste
        # limpar_dados_teste()
        # print()
        
        print("✅ CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!")
        print("🎯 O banco está pronto para desenvolvimento")
        
    except Exception as e:
        print(f"❌ Erro durante a configuração: {e}")
        raise
    finally:
        client.close()

if __name__ == "__main__":
    main() 