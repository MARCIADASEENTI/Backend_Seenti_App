import os
from pymongo import MongoClient
from bson import ObjectId

# Conexão com o MongoDB Atlas (mesma configuração do app.py)
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://<usuario>:<senha>@ps-terapia.8dgyy1d.mongodb.net/seenti_db")
client = MongoClient(MONGO_URI)
db = client["seenti_db"]

# Coleções
usuarios = db["usuarios"]
clientes = db["clientes"]
anamneses = db["anamneses"]
progresso_usuario = db["progresso_usuario"]

# Remover todos os clientes
res_clientes = clientes.delete_many({})
print(f"Clientes removidos: {res_clientes.deleted_count}")

# Remover todas as anamneses
res_anamneses = anamneses.delete_many({})
print(f"Anamneses removidas: {res_anamneses.deleted_count}")

# Remover todos os progressos de usuário
res_progresso = progresso_usuario.delete_many({})
print(f"Progresso de usuário removido: {res_progresso.deleted_count}")

# Remover todos os usuários exceto tipo 'T'
res_usuarios = usuarios.delete_many({"tipo_usuario": {"$ne": "T"}})
print(f"Usuários removidos (exceto tipo 'T'): {res_usuarios.deleted_count}")

print("Base limpa com sucesso!") 