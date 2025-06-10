from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from bson import ObjectId
from dotenv import load_dotenv
from datetime import datetime
import os

app = Flask(__name__)

# ✅ CORS configurado corretamente (mantém compatibilidade com frontend)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})


load_dotenv()
bcrypt = Bcrypt(app)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)
db = mongo.db
@app.route("/usuarios", methods=["POST"])
def cadastrar_usuario():
    data = request.get_json()

    email = data.get("email")
    senha = data.get("senha")
    consentimento = data.get("consentimento", False)
    tipo_usuario = data.get("tipo_usuario", "C")  # padrão: cliente

    if not all([email, senha]) or not consentimento:
        return jsonify({"erro": "Dados incompletos ou consentimento não aceito."}), 400

    if db.usuarios.find_one({"email": email}):
        return jsonify({"erro": "Usuário com este e-mail já existe."}), 409

    senha_hash = bcrypt.generate_password_hash(senha).decode('utf-8')

    usuario = {
        "email": email,
        "senha": senha_hash,
        "consentimento": consentimento,
        "tipo_usuario": tipo_usuario
    }

    resultado = db.usuarios.insert_one(usuario)

    return jsonify({
        "mensagem": "Usuário cadastrado com sucesso!",
        "usuario_id": str(resultado.inserted_id)
    }), 201
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")

    if not email or not senha:
        return jsonify({"erro": "Email e senha são obrigatórios."}), 400

    usuario = db.usuarios.find_one({"email": email})
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado."}), 404

    if not bcrypt.check_password_hash(usuario["senha"], senha):
        return jsonify({"erro": "Senha incorreta."}), 401

    return jsonify({
        "mensagem": "Login realizado com sucesso!",
        "usuario_id": str(usuario["_id"])
    }), 200

@app.route("/clientes", methods=["POST"])
def cadastrar_cliente():
    data = request.get_json()

    try:
        usuario_id = data["usuario_id"]
        nome_completo = data["nome_completo"]
        telefone = data["telefone"]
        data_nascimento = data["data_nascimento"]
        endereco = data["endereco"]

        cliente = {
            "usuario_id": ObjectId(usuario_id),
            "nome_completo": nome_completo,
            "telefone": telefone,
            "data_nascimento": data_nascimento,
            "endereco": {
                "rua": endereco.get("rua"),
                "numero": endereco.get("numero"),
                "complemento": endereco.get("complemento"),
                "bairro": endereco.get("bairro"),
                "cidade": endereco.get("cidade"),
                "estado": endereco.get("estado"),
                "uf": endereco.get("uf"),
                "cep": endereco.get("cep"),
                "caixa_postal": endereco.get("caixa_postal")
            }
        }

        db.clientes.insert_one(cliente)

        return jsonify({"mensagem": "Cliente cadastrado com sucesso!"}), 201

    except Exception as e:
        return jsonify({"erro": f"Erro ao cadastrar cliente: {str(e)}"}), 400

@app.route("/terapias", methods=["POST"])
def cadastrar_terapia():
    data = request.get_json()

    try:
        codigo = data["codigo"]
        nome = data["nome"]
        protocolo_execucao = data["protocolo_execucao"]

        if db.terapias.find_one({"codigo": codigo}):
            return jsonify({"erro": "Terapia com este código já existe."}), 409

        terapia = {
            "codigo": codigo,
            "nome": nome,
            "protocolo_execucao": protocolo_execucao
        }

        db.terapias.insert_one(terapia)

        return jsonify({"mensagem": "Terapia cadastrada com sucesso!"}), 201

    except Exception as e:
        return jsonify({"erro": f"Erro ao cadastrar terapia: {str(e)}"}), 400

@app.route("/anamneses", methods=["POST"])
def cadastrar_anamnese():
    data = request.get_json()
    cliente_id = data.get("cliente_id")

    if not cliente_id:
        return jsonify({"erro": "cliente_id é obrigatório."}), 400

    try:
        data["cliente_id"] = ObjectId(cliente_id)
    except Exception:
        return jsonify({"erro": "cliente_id inválido."}), 400

    # Adiciona data automática se não enviada
    if "data" not in data:
        data["data"] = datetime.utcnow()
    else:
        try:
            data["data"] = datetime.strptime(data["data"], "%Y-%m-%d")
        except ValueError:
            return jsonify({"erro": "Formato de data inválido."}), 400

    try:
        db.anamneses.insert_one(data)
        return jsonify({"mensagem": "Anamnese registrada com sucesso!"}), 201
    except Exception as e:
        return jsonify({"erro": f"Erro ao registrar anamnese: {str(e)}"}), 500


    # Remove terapia_id, se existir no payload por engano
    data.pop("terapia_id", None)

    # Insere a anamnese no banco
    db.anamneses.insert_one(data)
    return jsonify({"mensagem": "Anamnese cadastrada com sucesso!"}), 201

@app.route("/fitoterapicos", methods=["POST"])
def cadastrar_fitoterapico():
    data = request.get_json()

    nome = data.get("nome")
    tipo = data.get("tipo")
    grupos_quimicos = data.get("grupos_quimicos", [])
    efeitos_terapeuticos = data.get("efeitos_terapeuticos", [])
    contraindicacoes = data.get("contraindicacoes", [])
    interacoes = data.get("interacoes", [])
    uso_recomendado = data.get("uso_recomendado")

    if not all([nome, tipo, uso_recomendado]):
        return jsonify({"erro": "Campos obrigatórios ausentes."}), 400

    fitoterapico = {
        "nome": nome,
        "tipo": tipo,
        "grupos_quimicos": grupos_quimicos,
        "efeitos_terapeuticos": efeitos_terapeuticos,
        "contraindicacoes": contraindicacoes,
        "interacoes": interacoes,
        "uso_recomendado": uso_recomendado
    }

    db.fitoterapicos.insert_one(fitoterapico)
    return jsonify({"mensagem": "Fitoterápico cadastrado com sucesso!"}), 201

@app.route("/recomendacoes_fitoterapicos", methods=["POST"])
def cadastrar_recomendacao_fitoterapico():
    data = request.get_json()

    anamnese_id = data.get("anamnese_id")
    fitoterapico_id = data.get("fitoterapico_id")
    motivo = data.get("motivo")

    if not all([anamnese_id, fitoterapico_id, motivo]):
        return jsonify({"erro": "Campos obrigatórios ausentes."}), 400

    try:
        recomendacao = {
            "anamnese_id": ObjectId(anamnese_id),
            "fitoterapico_id": ObjectId(fitoterapico_id),
            "motivo": motivo
        }

        db.recomendacoes_fitoterapicos.insert_one(recomendacao)
        return jsonify({"mensagem": "Recomendação registrada com sucesso!"}), 201

    except Exception as e:
        return jsonify({"erro": f"Erro ao salvar recomendação: {str(e)}"}), 400
#listagem usuário
@app.route("/usuarios", methods=["GET"])
def listar_usuarios():
    usuarios = db.usuarios.find()
    lista = []
    for usuario in usuarios:
        lista.append({
            "id": str(usuario["_id"]),
            "email": usuario["email"],
            "cpf": usuario["cpf"],
            "consentimento": usuario["consentimento"]
        })
    return jsonify(lista), 200
#listagem de clientes
@app.route("/clientes", methods=["GET"])
def listar_clientes():
    try:
        clientes = db.clientes.find()
        resultado = []
        for cliente in clientes:
            resultado.append({
                "id": str(cliente["_id"]),
                "usuario_id": str(cliente["usuario_id"]),
                "nome_completo": cliente.get("nome_completo"),
                "telefone": cliente.get("telefone"),
                "data_nascimento": str(cliente.get("data_nascimento")),
                "endereco": cliente.get("endereco", {})
            })
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"erro": f"Erro ao listar clientes: {str(e)}"}), 500
#Listagem de Terapias
@app.route("/terapias", methods=["GET"])
def listar_terapias():
    try:
        terapias = db.terapias.find()
        resultado = []
        for terapia in terapias:
            resultado.append({
                "id": str(terapia["_id"]),
                "codigo": terapia.get("codigo"),
                "nome": terapia.get("nome"),
                "protocolo_execucao": terapia.get("protocolo_execucao")
            })
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"erro": f"Erro ao listar terapias: {str(e)}"}), 500
#listagem de Anamneses
@app.route("/anamneses", methods=["GET"])
def listar_anamneses():
    try:
        anamneses = db.anamneses.find()
        resultado = []
        for anamnese in anamneses:
            resultado.append({
                "id": str(anamnese["_id"]),
                "cliente_id": str(anamnese["cliente_id"]),
                "terapia_id": str(anamnese["terapia_id"]),
                "data": str(anamnese["data"]),
                "identificacao": anamnese.get("identificacao"),
                "queixa_principal": anamnese.get("queixa_principal"),
                "observacoes_finais": anamnese.get("observacoes_finais")
            })
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"erro": f"Erro ao listar anamneses: {str(e)}"}), 500
#Listagem de Fitoterapicos
@app.route("/fitoterapicos", methods=["GET"])
def listar_fitoterapicos():
    fitoterapicos = []
    for f in db.fitoterapicos.find():
        fitoterapicos.append({
            "id": str(f["_id"]),
            "nome": f.get("nome"),
            "tipo": f.get("tipo"),
            "grupos_quimicos": f.get("grupos_quimicos", []),
            "efeitos_terapeuticos": f.get("efeitos_terapeuticos", []),
            "contraindicacoes": f.get("contraindicacoes", []),
            "interacoes": f.get("interacoes", []),
            "uso_recomendado": f.get("uso_recomendado")
        })
    return jsonify(fitoterapicos)
#listagem Recomendacoes
@app.route("/recomendacoes-fitoterapicos", methods=["GET"])
def listar_recomendacoes_fitoterapicos():
    try:
        recomendacoes = []
        for rec in db.recomendacoes_fitoterapicos.find():
            anamnese = db.anamneses.find_one({"_id": rec["anamnese_id"]})
            fitoterapico = db.fitoterapicos.find_one({"_id": rec["fitoterapico_id"]})

            recomendacoes.append({
                "id": str(rec["_id"]),
                "anamnese_id": str(rec["anamnese_id"]),
                "fitoterapico_id": str(rec["fitoterapico_id"]),
                "motivo": rec["motivo"],
                "anamnese_info": {
                    "cliente_id": str(anamnese["cliente_id"]),
                    "terapia_id": str(anamnese["terapia_id"]),
                    "data": anamnese["data"].strftime("%Y-%m-%d")
                } if anamnese else {},
                "fitoterapico_info": {
                    "nome": fitoterapico.get("nome"),
                    "tipo": fitoterapico.get("tipo"),
                    "uso_recomendado": fitoterapico.get("uso_recomendado")
                } if fitoterapico else {}
            })

        return jsonify(recomendacoes), 200

    except Exception as e:
        return jsonify({"erro": f"Erro ao listar recomendações: {str(e)}"}), 500

#endpoint Tela de Aceite do Termo
@app.route("/termos_texto", methods=["GET"])
def obter_termo_texto():
    termo = db.termos_texto.find_one(sort=[("data_publicacao", -1)])
    if termo:
        return jsonify({
            "titulo": termo.get("titulo"),
            "conteudo_html": termo.get("conteudo_html"),
            "versao": termo.get("versao"),
            "data_publicacao": termo.get("data_publicacao").isoformat()
        }), 200
    return jsonify({"erro": "Termo de uso não encontrado."}), 404


#endpoint Termo de uso
@app.route("/termos_uso", methods=["POST"])
def aceitar_termo_uso():
    data = request.get_json()
    usuario_id = data.get("usuario_id")
    aceito = data.get("aceito", False)

    if not usuario_id or not aceito:
        return jsonify({"erro": "Aceite e ID do usuário são obrigatórios."}), 400

    termo = {
        "usuario_id": ObjectId(usuario_id),
        "aceito": True,
        "data_aceite": datetime.utcnow()
    }

    db.termos_uso.insert_one(termo)
    return jsonify({"mensagem": "Termo de uso aceito e registrado."}), 201

@app.route("/agendamentos", methods=["POST"])
def agendar():
    data = request.get_json()
    try:
        agendamento = {
            "cliente_id": ObjectId(data["cliente_id"]),
            "data": data["data"],
            "horario": data["horario"],
            "motivo": data.get("motivo", "")
        }
        db.agendamentos.insert_one(agendamento)
        return jsonify({"mensagem": "Agendamento salvo!"}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 400

@app.route("/anamneses/cliente/<cliente_id>", methods=["GET"])
def verificar_anamnese_cliente(cliente_id):
    try:
        anamnese = db.anamneses.find_one({"cliente_id": ObjectId(cliente_id)})
        return jsonify({"existe": bool(anamnese)}), 200
    except Exception as e:
        return jsonify({"erro": f"Erro ao verificar anamnese: {str(e)}"}), 500
    

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

