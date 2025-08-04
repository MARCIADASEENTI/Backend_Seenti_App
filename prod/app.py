from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId
from datetime import datetime
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
import os
import re  # ✅ Adicionado para tratar CPF
import sys

load_dotenv()  # ✅ Carrega as variáveis do .env
print(f"MONGO_URI: {os.getenv('MONGO_URI')}", file=sys.stderr)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

mongo = PyMongo(app)
db = mongo.db
usuarios = db["usuarios"]

# --- Coleções ---
usuarios = db["usuarios"]
clientes = db["clientes"]
anamneses = db["anamneses"]
termos_uso = db["termos_uso"]
progresso_usuario = db["progresso_usuario"]

# --- LOGIN ---
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json or {}
        email = data.get("email")
        senha = data.get("senha")

        if not email or not senha:
            return jsonify({"erro": "Email e senha são obrigatórios"}), 400

        usuario = usuarios.find_one({"email": email})
        if not usuario:
            return jsonify({"erro": "Usuário não encontrado. Deseja se cadastrar?"}), 404

        if not check_password_hash(usuario["senha"], senha):
            return jsonify({"erro": "Senha incorreta"}), 401

        return jsonify({
            "mensagem": "Login realizado com sucesso",
            "usuario_id": str(usuario["_id"]),
            "tipo_usuario": usuario.get("tipo_usuario", "C")
        }), 200
    except Exception as e:
        print(f"[ERRO LOGIN] {str(e)}")
        return jsonify({"erro": "Erro interno no servidor"}), 500

# --- CADASTRO USUÁRIO ---
@app.route("/usuarios", methods=["POST"])
def criar_usuario():
    data = request.json or {}
    email = data.get("email")
    senha = data.get("senha")
    tipo_usuario = data.get("tipo_usuario", "C")

    if not email or not senha:
        return jsonify({"erro": "Email e senha são obrigatórios"}), 400

    if usuarios.find_one({"email": email}):
        return jsonify({"erro": "Email já cadastrado"}), 409

    senha_hash = generate_password_hash(senha)
    novo_usuario = {
        "email": email,
        "senha": senha_hash,
        "tipo_usuario": tipo_usuario,
        "consentimento": False,
        "tenant_id": data.get("tenant_id", "686af5e0bb776faa73fa8e03"),
        "data_criacao": datetime.now(),
        "data_atualizacao": datetime.now(),
        "ativo": True
    }
    resultado = usuarios.insert_one(novo_usuario)
    return jsonify({"mensagem": "Usuário criado com sucesso", "usuario_id": str(resultado.inserted_id)}), 201

# --- TERMO DE USO ---
@app.route("/termos_uso", methods=["POST"])
def termos_uso():
    data = request.json or {}
    usuario_id = data.get('usuario_id')
    consentimento = data.get('consentimento')

    if not usuario_id:
        return jsonify({"erro": "Campo 'usuario_id' é obrigatório."}), 400

    if consentimento is not True:
        return jsonify({"erro": "O consentimento precisa ser True."}), 400

    resultado = usuarios.update_one(
        {"_id": ObjectId(usuario_id)},
        {"$set": {"consentimento": True}}
    )

    if resultado.matched_count == 0:
        return jsonify({"erro": "Usuário não encontrado."}), 404

    return jsonify({"mensagem": "Termo de uso aceito com sucesso."}), 200

@app.route("/termos_texto", methods=["GET"])
def obter_termos():
    texto_completo = """
    TERMO DE CONSENTIMENTO E USO

    Este aplicativo coleta dados pessoais e de saúde para viabilizar o atendimento personalizado em Terapias Integrativas.
    Ao continuar, você declara estar ciente e de acordo com:

    - O uso dos dados para fins de registro clínico, evolução terapêutica e contato.
    - O armazenamento seguro das informações, em conformidade com a LGPD.
    - A possibilidade de revogar este consentimento a qualquer momento, solicitando a exclusão dos dados.

    Em caso de dúvidas, entre em contato com nossa equipe.

    """

    return jsonify({"termo": texto_completo.strip()}), 200

# --- CLIENTE ---
@app.route("/clientes", methods=["POST"])
def cadastrar_cliente():
    data = request.json or {}
    
    # Debug: imprimir dados recebidos
    print(f"Dados recebidos: {data}")

    # Campos obrigatórios
    campos_obrigatorios = ["usuario_id", "primeiro_nome", "sobrenome", "cpf", "data_nascimento"]
    for campo in campos_obrigatorios:
        if not data.get(campo):
            return jsonify({"erro": f"Campo '{campo}' é obrigatório."}), 400

    # Validação de CPF
    cpf = re.sub(r'[^0-9]', '', data["cpf"])
    if len(cpf) != 11:
        return jsonify({"erro": "CPF inválido"}), 400
    
    # Verifica se todos os dígitos são iguais
    if cpf == cpf[0] * 11:
        return jsonify({"erro": "CPF inválido"}), 400
    
    # Validação dos dígitos verificadores
    for i in range(9, 11):
        value = sum((int(cpf[num]) * ((i + 1) - num) for num in range(0, i)))
        digit = ((value * 10) % 11) % 10
        if int(cpf[i]) != digit:
            return jsonify({"erro": "CPF inválido"}), 400

    # Validação de idade
    try:
        data_nasc = datetime.strptime(data["data_nascimento"], "%Y-%m-%d")
        hoje = datetime.now()
        idade = hoje.year - data_nasc.year
        if hoje.month < data_nasc.month or (hoje.month == data_nasc.month and hoje.day < data_nasc.day):
            idade -= 1
        if idade < 18:
            return jsonify({"erro": "É necessário ter 18 anos ou mais"}), 400
    except (ValueError, TypeError):
        return jsonify({"erro": "Data de nascimento inválida"}), 400

    # Verificar telefone (pode estar no nível raiz ou no subdocumento contato)
    telefone = None
    if data.get("telefone"):
        telefone = data["telefone"]
    elif data.get("contato", {}).get("telefone"):
        telefone = data["contato"]["telefone"]
    else:
        return jsonify({"erro": "Campo 'telefone' é obrigatório."}), 400

    # Validação de endereço (novo)
    endereco = data.get("endereco", {})
    campos_endereco_obrigatorios = ["rua", "numero", "bairro", "cidade", "estado", "cep"]
    for campo in campos_endereco_obrigatorios:
        if not endereco.get(campo):
            return jsonify({"erro": f"Campo de endereço '{campo}' é obrigatório"}), 400
    
    # Validação de CEP (formato brasileiro)
    cep = re.sub(r'[^0-9]', '', endereco.get("cep", ""))
    if not re.match(r'^\d{8}$', cep):
        return jsonify({"erro": "CEP inválido. Use formato: 00000-000"}), 400
    
    # Validação de estado (sigla brasileira)
    estados_validos = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"]
    if endereco.get("estado") not in estados_validos:
        return jsonify({"erro": "Estado inválido. Use sigla brasileira (ex: SP, RJ, MG)"}), 400

    # Verificar se CPF já existe
    cpf_existente = clientes.find_one({"cpf": cpf})
    if cpf_existente:
        return jsonify({"erro": "CPF já cadastrado"}), 409

    try:
        # Debug: verificar usuario_id
        print(f"usuario_id recebido: {data['usuario_id']}")
        usuario_obj_id = ObjectId(data["usuario_id"])
        print(f"usuario_id convertido: {usuario_obj_id}")
        
        # Preparar dados para inserção com nova estrutura
        dados_cliente = {
            "usuario_id": usuario_obj_id,
            "primeiro_nome": data["primeiro_nome"].strip(),
            "sobrenome": data["sobrenome"].strip(),
            "nome_social": data.get("nome_social", "").strip() or None,
            "cpf": cpf,
            "data_nascimento": data_nasc,
            "genero": data.get("genero") or None,
            
            # Subdocumento contato
            "contato": {
                "telefone": telefone,
                "email_alternativo": data.get("email_alternativo", "").strip() or None
            },
            
            # Subdocumento endereco
            "endereco": {
                "rua": data.get("endereco", {}).get("rua", "").strip(),
                "numero": data.get("endereco", {}).get("numero", "").strip(),
                "complemento": data.get("endereco", {}).get("complemento", "").strip() or None,
                "bairro": data.get("endereco", {}).get("bairro", "").strip(),
                "cidade": data.get("endereco", {}).get("cidade", "").strip(),
                "estado": data.get("endereco", {}).get("estado", "").strip(),
                "cep": data.get("endereco", {}).get("cep", "").strip()
            },
            
            "tenant_id": data.get("tenant_id", "686af5e0bb776faa73fa8e03"),  # Tenant padrão
            "status": "pendente",
            "data_criacao": datetime.now(),
            "data_atualizacao": datetime.now()
        }
        
        resultado = clientes.insert_one(dados_cliente)
        return jsonify({"mensagem": "Cliente cadastrado", "cliente_id": str(resultado.inserted_id)}), 201
    except Exception as e:
        print(f"Erro detalhado: {str(e)}")
        return jsonify({"erro": f"Erro ao cadastrar cliente: {str(e)}"}), 500

@app.route("/clientes/<cliente_id>", methods=["GET"])
def buscar_cliente(cliente_id):
    try:
        obj_id = ObjectId(cliente_id)
    except Exception:
        return jsonify({"erro": "ID de cliente inválido"}), 400

    cliente = clientes.find_one({"_id": obj_id})
    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    cliente["_id"] = str(cliente["_id"])
    cliente["usuario_id"] = str(cliente["usuario_id"])
    return jsonify(cliente), 200

# --- ANAMNESE ---
@app.route("/anamneses", methods=["POST"])
def criar_anamnese():
    data = request.json or {}
    cliente_id = data.get("cliente_id")
    dados_anamnese = data.get("dados")

    if not cliente_id or not dados_anamnese:
        return jsonify({"erro": "cliente_id e dados são obrigatórios"}), 400

    try:
        cliente_obj_id = ObjectId(cliente_id)
    except Exception:
        return jsonify({"erro": "ID de cliente inválido"}), 400

    # Verificar se cliente existe
    cliente = clientes.find_one({"_id": cliente_obj_id})
    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    # Verificar se já existe anamnese para este cliente (regra de negócio)
    anamnese_existente = anamneses.find_one({"cliente_id": cliente_obj_id})
    if anamnese_existente:
        return jsonify({"erro": "Cliente já possui uma anamnese registrada"}), 409

    # Validação dos campos obrigatórios
    campos_obrigatorios = [
        "objetivo", "area_enfase", "dor_atual", "funcionamento_intestinal",
        "stress_diario", "enxaqueca", "depressao", "insonia", "dor_mandibula",
        "bruxismo", "disturbio_renal", "antecedente_oncologico", "pedra_rim",
        "pedra_vesicula", "doenca_cronica", "email", "whatsapp"
    ]
    
    for campo in campos_obrigatorios:
        if campo not in dados_anamnese:
            return jsonify({"erro": f"Campo obrigatório '{campo}' não encontrado"}), 400

    # Validação de tipos de dados
    campos_booleanos = [
        "enxaqueca", "depressao", "insonia", "dor_mandibula", "bruxismo",
        "disturbio_renal", "antecedente_oncologico", "pedra_rim",
        "pedra_vesicula", "doenca_cronica"
    ]
    
    for campo in campos_booleanos:
        if not isinstance(dados_anamnese[campo], bool):
            return jsonify({"erro": f"Campo '{campo}' deve ser true ou false"}), 400

    # Validação de email
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w{2,}$'
    if not re.match(email_regex, dados_anamnese["email"]):
        return jsonify({"erro": "Formato de email inválido"}), 400

    # Validação de WhatsApp (formato brasileiro opcional)
    whatsapp_regex = r'^\(?\d{2}\)? ?\d{4,5}-?\d{4}$'
    if not re.match(whatsapp_regex, dados_anamnese["whatsapp"]):
        return jsonify({"erro": "Formato de WhatsApp inválido. Use: (31) 99999-9999"}), 400

    # Validação de funcionamento intestinal
    valores_validos_intestino = ["normal", "preso", "solto"]
    if dados_anamnese["funcionamento_intestinal"].lower() not in valores_validos_intestino:
        return jsonify({"erro": "Funcionamento intestinal deve ser: normal, preso ou solto"}), 400

    # Validação de stress diário
    valores_validos_stress = ["baixo", "moderado", "alto"]
    if dados_anamnese["stress_diario"].lower() not in valores_validos_stress:
        return jsonify({"erro": "Stress diário deve ser: baixo, moderado ou alto"}), 400

    # Preparar dados para inserção
    anamnese_data = {
        "cliente_id": cliente_obj_id,
        "data_envio": datetime.now(),
        "dados": {
            "objetivo": dados_anamnese["objetivo"].strip(),
            "area_enfase": dados_anamnese["area_enfase"].strip(),
            "dor_atual": dados_anamnese["dor_atual"].strip(),
            "funcionamento_intestinal": dados_anamnese["funcionamento_intestinal"].lower(),
            "anticoncepcional": dados_anamnese.get("anticoncepcional", "").strip() or None,
            "alimentacao": dados_anamnese.get("alimentacao", "").strip() or None,
            "stress_diario": dados_anamnese["stress_diario"].lower(),
            "enxaqueca": dados_anamnese["enxaqueca"],
            "depressao": dados_anamnese["depressao"],
            "insonia": dados_anamnese["insonia"],
            "dor_mandibula": dados_anamnese["dor_mandibula"],
            "bruxismo": dados_anamnese["bruxismo"],
            "disturbio_renal": dados_anamnese["disturbio_renal"],
            "antecedente_oncologico": dados_anamnese["antecedente_oncologico"],
            "pedra_rim": dados_anamnese["pedra_rim"],
            "pedra_vesicula": dados_anamnese["pedra_vesicula"],
            "doenca_cronica": dados_anamnese["doenca_cronica"],
            "observacoes_saude": dados_anamnese.get("observacoes_saude", "").strip() or None,
            "nao_gosta_massagem_em": dados_anamnese.get("nao_gosta_massagem_em", "").strip() or None,
            "email": dados_anamnese["email"].strip(),
            "whatsapp": dados_anamnese["whatsapp"].strip()
        }
    }
    
    resultado = anamneses.insert_one(anamnese_data)
    return jsonify({
        "mensagem": "Anamnese registrada com sucesso", 
        "anamnese_id": str(resultado.inserted_id)
    }), 201

@app.route("/anamneses/cliente/<cliente_id>", methods=["GET"])
def buscar_anamnese(cliente_id):
    try:
        obj_id = ObjectId(cliente_id)
    except Exception:
        return jsonify({"erro": "ID de cliente inválido"}), 400

    resultado = list(anamneses.find({"cliente_id": obj_id}))
    for doc in resultado:
        doc["_id"] = str(doc["_id"])
        doc["cliente_id"] = str(doc["cliente_id"])
    return jsonify(resultado), 200

# --- PROGRESSO USUÁRIO ---
@app.route("/progresso_usuario", methods=["POST"])
def registrar_progresso():
    """Registra progresso do usuário em uma funcionalidade"""
    data = request.json or {}
    usuario_id = data.get("usuario_id")
    funcionalidade = data.get("funcionalidade")
    etapa = data.get("etapa", 0)
    extra_data = data.get("extra_data", {})

    if not usuario_id or not funcionalidade:
        return jsonify({"erro": "usuario_id e funcionalidade são obrigatórios"}), 400

    try:
        usuario_obj_id = ObjectId(usuario_id)
    except Exception:
        return jsonify({"erro": "usuario_id inválido"}), 400

    # Verificar se já existe progresso para esta funcionalidade
    progresso_existente = progresso_usuario.find_one({
        "usuario_id": usuario_obj_id,
        "funcionalidade": funcionalidade
    })

    dados_progresso = {
        "usuario_id": usuario_obj_id,
        "funcionalidade": funcionalidade,
        "etapa": etapa,
        "data_conclusao": datetime.now(),
        "extra_data": extra_data
    }

    if progresso_existente:
        # Atualizar progresso existente
        resultado = progresso_usuario.update_one(
            {"_id": progresso_existente["_id"]},
            {"$set": dados_progresso}
        )
        mensagem = "Progresso atualizado"
    else:
        # Criar novo progresso
        resultado = progresso_usuario.insert_one(dados_progresso)
        mensagem = "Progresso registrado"

    return jsonify({"mensagem": mensagem}), 200

@app.route("/progresso_usuario/<usuario_id>", methods=["GET"])
def buscar_progresso(usuario_id):
    """Busca progresso de um usuário"""
    try:
        usuario_obj_id = ObjectId(usuario_id)
    except Exception:
        return jsonify({"erro": "usuario_id inválido"}), 400

    resultado = list(progresso_usuario.find({"usuario_id": usuario_obj_id}))
    for doc in resultado:
        doc["_id"] = str(doc["_id"])
        doc["usuario_id"] = str(doc["usuario_id"])
        doc["data_conclusao"] = doc["data_conclusao"].isoformat()

    return jsonify(resultado), 200

@app.route("/progresso_usuario/<usuario_id>/etapas", methods=["GET"])
def buscar_etapas_concluidas(usuario_id):
    """Retorna etapas concluídas por um usuário"""
    try:
        usuario_obj_id = ObjectId(usuario_id)
    except Exception:
        return jsonify({"erro": "usuario_id inválido"}), 400

    etapas_esperadas = [
        {"funcionalidade": "cadastro_usuario", "etapa": 0},
        {"funcionalidade": "aceite_termo", "etapa": 1},
        {"funcionalidade": "cadastro_cliente", "etapa": 2},
        {"funcionalidade": "anamnese_preenchida", "etapa": 3},
        {"funcionalidade": "agendamento", "etapa": 4}
    ]

    progresso_atual = list(progresso_usuario.find({"usuario_id": usuario_obj_id}))
    progresso_dict = {p["funcionalidade"]: p["etapa"] for p in progresso_atual}

    etapas_status = []
    for etapa in etapas_esperadas:
        etapa_atual = progresso_dict.get(etapa["funcionalidade"], -1)
        etapas_status.append({
            "funcionalidade": etapa["funcionalidade"],
            "etapa_esperada": etapa["etapa"],
            "etapa_atual": etapa_atual,
            "concluida": etapa_atual >= etapa["etapa"]
        })

    return jsonify({
        "usuario_id": usuario_id,
        "etapas": etapas_status,
        "total_etapas": len(etapas_esperadas),
        "etapas_concluidas": sum(1 for e in etapas_status if e["concluida"])
    }), 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")