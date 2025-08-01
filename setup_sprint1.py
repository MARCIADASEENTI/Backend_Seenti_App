"""
SETUP SPRINT 1 - SEENTI
Implementação das coleções faltantes para completar a Sprint 1
"""

import os
from datetime import datetime
from pymongo import MongoClient, ASCENDING
from bson import ObjectId

# Configuração da conexão
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://App_mdb:nJkn86qjYvUjlwpJ@ps-terapia.8dgyy1d.mongodb.net/seenti_db")
client = MongoClient(MONGO_URI)
db = client["seenti_db"]

def criar_colecoes_faltantes():
    """Cria as coleções faltantes para a Sprint 1"""
    print("🚀 Criando coleções faltantes para Sprint 1...")
    
    # Lista de coleções faltantes
    colecoes_faltantes = [
        "terapeutas",
        "agendamentos", 
        "prontuarios",
        "logs_acesso",
        "logs_alteracoes",
        "progresso_usuario"
    ]
    
    for colecao in colecoes_faltantes:
        if colecao not in db.list_collection_names():
            db.create_collection(colecao)
            print(f"  ✅ Coleção criada: {colecao}")
        else:
            print(f"  ℹ️ Coleção já existe: {colecao}")

def criar_indices_novas_colecoes():
    """Cria índices para as novas coleções"""
    print("🔧 Criando índices para novas coleções...")
    
    indices_config = {
        "terapeutas": [
            [("usuario_id", ASCENDING)],  # único
            [("cpf", ASCENDING), ("tenant_id", ASCENDING)],  # único por tenant
            [("tenant_id", ASCENDING)]
        ],
        "agendamentos": [
            [("cliente_id", ASCENDING)],
            [("terapeuta_id", ASCENDING)],
            [("data_hora", ASCENDING)],
            [("status", ASCENDING)],
            [("tenant_id", ASCENDING)]
        ],
        "prontuarios": [
            [("cliente_id", ASCENDING)],  # único
            [("tenant_id", ASCENDING)]
        ],
        "logs_acesso": [
            [("usuario_id", ASCENDING)],
            [("acao", ASCENDING)],
            [("data_criacao", ASCENDING)],
            [("tenant_id", ASCENDING)]
        ],
        "logs_alteracoes": [
            [("usuario_id", ASCENDING)],
            [("tabela", ASCENDING)],
            [("registro_id", ASCENDING)],
            [("data_criacao", ASCENDING)],
            [("tenant_id", ASCENDING)]
        ]
    }
    
    for colecao, indices in indices_config.items():
        collection = db[colecao]
        
        for i, indice in enumerate(indices):
            try:
                if len(indice) == 1 and indice[0][0] in ["usuario_id", "cliente_id"]:
                    # Índice único para referências
                    collection.create_index(
                        indice,
                        unique=True,
                        name=f"idx_{colecao}_{indice[0][0]}_unique"
                    )
                    print(f"  ✅ Índice único criado: {colecao}.{indice[0][0]}")
                elif len(indice) > 1:
                    # Índice composto
                    collection.create_index(
                        indice,
                        unique=True,
                        name=f"idx_{colecao}_{i}_composto"
                    )
                    print(f"  ✅ Índice composto criado: {colecao}.{indice}")
                else:
                    # Índice simples
                    collection.create_index(indice[0], ASCENDING)
                    print(f"  ✅ Índice criado: {colecao}.{indice[0][0]}")
            except Exception as e:
                print(f"  ⚠️ Erro ao criar índice {colecao}: {e}")

def criar_dados_exemplo():
    """Cria dados de exemplo para testes"""
    print("📝 Criando dados de exemplo...")
    
    # Obter tenant padrão
    tenant_padrao = db["tenants"].find_one({"codigo": "seenti"})
    if not tenant_padrao:
        print("  ❌ Tenant padrão não encontrado. Execute setup_database.py primeiro.")
        return
    
    tenant_id = tenant_padrao["_id"]
    
    # Criar usuário terapeuta de exemplo
    terapeuta_usuario = {
        "_id": ObjectId(),
        "email": "terapeuta@seenti.com.br",
        "senha": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqjYvU",  # "12345678"
        "tipo_usuario": "T",
        "consentimento": True,
        "tenant_id": tenant_id,
        "data_criacao": datetime.now(),
        "data_atualizacao": datetime.now(),
        "ativo": True
    }
    
    # Verificar se já existe
    if not db["usuarios"].find_one({"email": terapeuta_usuario["email"]}):
        db["usuarios"].insert_one(terapeuta_usuario)
        print(f"  ✅ Usuário terapeuta criado: {terapeuta_usuario['email']}")
        
        # Criar perfil do terapeuta
        terapeuta_perfil = {
            "_id": ObjectId(),
            "usuario_id": terapeuta_usuario["_id"],
            "nome_completo": "Dr. João Silva",
            "cpf": "12345678901",
            "crm": "CRM-SP 12345",
            "especialidades": ["Terapia Integrativa", "Acupuntura"],
            "telefone": "11999999999",
            "email_profissional": "joao.silva@seenti.com.br",
            "tenant_id": tenant_id,
            "status": "ativo",
            "data_criacao": datetime.now(),
            "data_atualizacao": datetime.now()
        }
        
        db["terapeutas"].insert_one(terapeuta_perfil)
        print(f"  ✅ Perfil terapeuta criado: {terapeuta_perfil['nome_completo']}")
    else:
        print(f"  ℹ️ Usuário terapeuta já existe")

def verificar_estrutura_completa():
    """Verifica se todas as coleções necessárias existem"""
    print("🔍 Verificando estrutura completa...")
    
    colecoes_esperadas = [
        "usuarios", "clientes", "anamneses", "termos_uso", "tenants",
        "terapeutas", "agendamentos", "prontuarios", "logs_acesso", "logs_alteracoes"
    ]
    
    for colecao in colecoes_esperadas:
        if colecao in db.list_collection_names():
            count = db[colecao].count_documents({})
            print(f"  ✅ {colecao}: {count} documentos")
        else:
            print(f"  ❌ {colecao}: coleção não existe")

def main():
    """Função principal"""
    print("=" * 60)
    print("🚀 SETUP SPRINT 1 - SEENTI")
    print("=" * 60)
    
    try:
        # 1. Criar coleções faltantes
        criar_colecoes_faltantes()
        print()
        
        # 2. Criar índices
        criar_indices_novas_colecoes()
        print()
        
        # 3. Criar dados de exemplo
        criar_dados_exemplo()
        print()
        
        # 4. Verificar estrutura
        verificar_estrutura_completa()
        print()
        
        print("✅ Setup Sprint 1 concluído com sucesso!")
        print()
        print("📋 Próximos passos:")
        print("1. Implementar endpoints para terapeutas")
        print("2. Implementar endpoints para agendamentos")
        print("3. Implementar endpoints para prontuários")
        print("4. Implementar logs de auditoria")
        print("5. Testar fluxo completo")
        
    except Exception as e:
        print(f"❌ Erro durante o setup: {e}")
        return False
    
    return True

if __name__ == "__main__":
    main() 