#!/usr/bin/env python3
"""
Script para configurar a coleção de terapeutas para o sistema de agendamentos
Execute este script após configurar o banco de dados principal
"""

import os
import sys
from datetime import datetime
from bson import ObjectId
from dotenv import load_dotenv
from pymongo import MongoClient

# Carregar variáveis de ambiente
load_dotenv()

def conectar_mongo():
    """Conecta ao MongoDB"""
    try:
        mongo_uri = os.getenv('MONGO_URI')
        if not mongo_uri:
            print("❌ MONGO_URI não encontrada no arquivo .env")
            return None
        
        client = MongoClient(mongo_uri)
        db = client.get_database()
        print(f"✅ Conectado ao MongoDB: {db.name}")
        return db
    except Exception as e:
        print(f"❌ Erro ao conectar ao MongoDB: {e}")
        return None

def criar_colecao_terapeutas(db):
    """Cria a coleção de terapeutas se não existir"""
    try:
        if "terapeutas" not in db.list_collection_names():
            db.create_collection("terapeutas")
            print("✅ Coleção 'terapeutas' criada")
        else:
            print("ℹ️ Coleção 'terapeutas' já existe")
        
        return db["terapeutas"]
    except Exception as e:
        print(f"❌ Erro ao criar coleção: {e}")
        return None

def criar_indices_terapeutas(collection):
    """Cria índices para a coleção de terapeutas"""
    try:
        # Índice único para CPF por tenant
        collection.create_index([("cpf", 1), ("tenant_id", 1)], unique=True)
        print("✅ Índice único CPF + tenant criado")
        
        # Índice para usuário_id
        collection.create_index([("usuario_id", 1)], unique=True)
        print("✅ Índice único usuario_id criado")
        
        # Índice para tenant_id
        collection.create_index([("tenant_id", 1)])
        print("✅ Índice tenant_id criado")
        
        # Índice para status
        collection.create_index([("ativo", 1)])
        print("✅ Índice ativo criado")
        
    except Exception as e:
        print(f"⚠️ Erro ao criar índices: {e}")

def criar_terapeutas_exemplo(collection, tenant_id):
    """Cria terapeutas de exemplo para testes"""
    terapeutas_exemplo = [
        {
            "_id": ObjectId(),
            "usuario_id": ObjectId(),  # Será criado um usuário terapeuta
            "nome_completo": "Dr. João Silva",
            "cpf": "12345678901",
            "crm": "CRM-SP 12345",
            "especialidades": ["Terapia Integrativa", "Acupuntura", "Massoterapia"],
            "telefone": "11999999999",
            "email": "joao.silva@seenti.com.br",
            "bio": "Especialista em terapias integrativas com mais de 10 anos de experiência",
            "formacao": ["Medicina - USP", "Especialização em Acupuntura"],
            "horarios_disponiveis": ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"],
            "dias_trabalho": ["segunda", "terca", "quarta", "quinta", "sexta"],
            "ativo": True,
            "tenant_id": tenant_id,
            "data_criacao": datetime.now(),
            "data_atualizacao": datetime.now()
        },
        {
            "_id": ObjectId(),
            "usuario_id": ObjectId(),  # Será criado um usuário terapeuta
            "nome_completo": "Dra. Maria Santos",
            "cpf": "98765432100",
            "crm": "CRM-RJ 54321",
            "especialidades": ["Terapia Integrativa", "Reiki", "Cromoterapia"],
            "telefone": "21988888888",
            "email": "maria.santos@seenti.com.br",
            "bio": "Terapeuta holística especializada em energização e equilíbrio energético",
            "formacao": ["Terapia Ocupacional - UFRJ", "Formação em Reiki", "Cromoterapia"],
            "horarios_disponiveis": ["09:00", "10:00", "11:00", "15:00", "16:00", "17:00"],
            "dias_trabalho": ["segunda", "terca", "quarta", "quinta", "sexta"],
            "ativo": True,
            "tenant_id": tenant_id,
            "data_criacao": datetime.now(),
            "data_atualizacao": datetime.now()
        },
        {
            "_id": ObjectId(),
            "usuario_id": ObjectId(),  # Será criado um usuário terapeuta
            "nome_completo": "Prof. Carlos Oliveira",
            "cpf": "45678912300",
            "crm": "CRM-MG 67890",
            "especialidades": ["Terapia Integrativa", "Quiropraxia", "Fisioterapia"],
            "telefone": "31777777777",
            "email": "carlos.oliveira@seenti.com.br",
            "bio": "Fisioterapeuta especializado em técnicas manuais e alinhamento postural",
            "formacao": ["Fisioterapia - UFMG", "Especialização em Quiropraxia"],
            "horarios_disponiveis": ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"],
            "dias_trabalho": ["segunda", "terca", "quarta", "quinta", "sexta"],
            "ativo": True,
            "tenant_id": tenant_id,
            "data_criacao": datetime.now(),
            "data_atualizacao": datetime.now()
        }
    ]
    
    # Criar usuários terapeutas primeiro
    usuarios_collection = db["usuarios"]
    for terapeuta in terapeutas_exemplo:
        # Criar usuário terapeuta
        usuario_terapeuta = {
            "_id": terapeuta["usuario_id"],
            "email": terapeuta["email"],
            "senha": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqjYvU",  # "12345678"
            "tipo_usuario": "T",
            "consentimento": True,
            "tenant_id": tenant_id,
            "data_criacao": datetime.now(),
            "data_atualizacao": datetime.now(),
            "ativo": True
        }
        
        try:
            usuarios_collection.insert_one(usuario_terapeuta)
            print(f"✅ Usuário terapeuta criado: {terapeuta['nome_completo']}")
        except Exception as e:
            print(f"⚠️ Usuário terapeuta já existe: {terapeuta['nome_completo']}")
    
    # Inserir terapeutas
    for terapeuta in terapeutas_exemplo:
        try:
            collection.insert_one(terapeuta)
            print(f"✅ Terapeuta criado: {terapeuta['nome_completo']}")
        except Exception as e:
            print(f"⚠️ Terapeuta já existe: {terapeuta['nome_completo']}")

def main():
    """Função principal"""
    print("🏥 CONFIGURAÇÃO DA COLEÇÃO DE TERAPEUTAS - SEENTI")
    print("=" * 60)
    
    # Conectar ao MongoDB
    db = conectar_mongo()
    if not db:
        sys.exit(1)
    
    # Obter tenant padrão
    tenant_padrao = db["tenants"].find_one({"codigo": "seenti"})
    if not tenant_padrao:
        print("❌ Tenant padrão não encontrado. Execute setup_database.py primeiro.")
        sys.exit(1)
    
    tenant_id = tenant_padrao["_id"]
    print(f"✅ Tenant encontrado: {tenant_padrao['nome']}")
    
    # Criar coleção de terapeutas
    collection = criar_colecao_terapeutas(db)
    if not collection:
        sys.exit(1)
    
    # Criar índices
    criar_indices_terapeutas(collection)
    
    # Criar terapeutas de exemplo
    print("\n👥 Criando terapeutas de exemplo...")
    criar_terapeutas_exemplo(collection, tenant_id)
    
    print("\n🎉 Configuração concluída com sucesso!")
    print("📊 Estatísticas:")
    print(f"   - Total de terapeutas: {collection.count_documents({})}")
    print(f"   - Terapeutas ativos: {collection.count_documents({'ativo': True})}")

if __name__ == "__main__":
    main()
