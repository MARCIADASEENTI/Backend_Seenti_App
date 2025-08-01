"""
MÓDULO DE VALIDAÇÕES - SEENTI BACKEND
Validações centralizadas para todos os endpoints
"""

import re
from datetime import datetime, date
from typing import Dict, Any, Tuple, Optional
from bson import ObjectId
from database_schema import (
    SchemaUsuario, SchemaCliente, SchemaAnamnese, 
    MENSAGENS_ERRO, validar_object_id, validar_tenant_id
)

class ValidationError(Exception):
    """Exceção personalizada para erros de validação"""
    def __init__(self, message: str, field: str = None):
        self.message = message
        self.field = field
        super().__init__(self.message)

def validar_dados_usuario(data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """Valida dados para criação/atualização de usuário"""
    
    # Campos obrigatórios
    campos_obrigatorios = ["email", "senha"]
    for campo in campos_obrigatorios:
        if not data.get(campo):
            return False, MENSAGENS_ERRO["campo_obrigatorio"].format(campo=campo)
    
    # Validação de email
    if not SchemaUsuario.validar_email(data["email"]):
        return False, MENSAGENS_ERRO["email_invalido"]
    
    # Validação de senha
    if not SchemaUsuario.validar_senha(data["senha"]):
        return False, MENSAGENS_ERRO["senha_fraca"]
    
    # Validação de tipo_usuario
    tipo_usuario = data.get("tipo_usuario", "C")
    if tipo_usuario not in ["C", "T", "A"]:
        return False, "Tipo de usuário inválido"
    
    # Validação de tenant_id
    tenant_id = data.get("tenant_id")
    if not tenant_id:
        return False, "Tenant ID é obrigatório"
    
    if not validar_object_id(tenant_id):
        return False, "Tenant ID inválido"
    
    return True, None

def validar_dados_cliente(data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """Valida dados para criação/atualização de cliente"""
    
    # Campos obrigatórios
    campos_obrigatorios = [
        "usuario_id", "primeiro_nome", "sobrenome", 
        "cpf", "data_nascimento", "telefone"
    ]
    
    for campo in campos_obrigatorios:
        if not data.get(campo):
            return False, MENSAGENS_ERRO["campo_obrigatorio"].format(campo=campo)
    
    # Validação de usuario_id
    if not validar_object_id(data["usuario_id"]):
        return False, "ID de usuário inválido"
    
    # Validação de CPF
    if not SchemaCliente.validar_cpf(data["cpf"]):
        return False, MENSAGENS_ERRO["cpf_invalido"]
    
    # Validação de data de nascimento
    try:
        if isinstance(data["data_nascimento"], str):
            data_nasc = datetime.strptime(data["data_nascimento"], "%Y-%m-%d").date()
        else:
            data_nasc = data["data_nascimento"]
        
        if not SchemaCliente.validar_idade(data_nasc):
            return False, MENSAGENS_ERRO["idade_insuficiente"]
    except (ValueError, TypeError):
        return False, "Data de nascimento inválida"
    
    # Validação de telefone (formato básico)
    telefone = re.sub(r'[^0-9]', '', data["telefone"])
    if len(telefone) < 10 or len(telefone) > 11:
        return False, "Telefone inválido"
    
    # Validação de tenant_id
    tenant_id = data.get("tenant_id")
    if not tenant_id:
        return False, "Tenant ID é obrigatório"
    
    if not validar_object_id(tenant_id):
        return False, "Tenant ID inválido"
    
    return True, None

def validar_dados_anamnese(data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """Valida dados para criação/atualização de anamnese"""
    
    # Campos obrigatórios
    campos_obrigatorios = ["cliente_id", "dados"]
    for campo in campos_obrigatorios:
        if not data.get(campo):
            return False, MENSAGENS_ERRO["campo_obrigatorio"].format(campo=campo)
    
    # Validação de cliente_id
    if not validar_object_id(data["cliente_id"]):
        return False, "ID de cliente inválido"
    
    # Validação de dados da anamnese
    dados = data["dados"]
    if not isinstance(dados, dict):
        return False, "Dados da anamnese devem ser um objeto"
    
    # Validação básica da estrutura
    estrutura_esperada = SchemaAnamnese.get_estrutura_dados()
    
    for secao, campos in estrutura_esperada.items():
        if secao not in dados:
            return False, f"Seção '{secao}' é obrigatória na anamnese"
        
        if isinstance(campos, dict):
            for campo in campos:
                if campo not in dados[secao]:
                    return False, f"Campo '{campo}' é obrigatório na seção '{secao}'"
    
    # Validação de tenant_id
    tenant_id = data.get("tenant_id")
    if not tenant_id:
        return False, "Tenant ID é obrigatório"
    
    if not validar_object_id(tenant_id):
        return False, "Tenant ID inválido"
    
    return True, None

def validar_aceite_termo(data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """Valida dados para aceite de termo de uso"""
    
    # Campos obrigatórios
    if not data.get("usuario_id"):
        return False, MENSAGENS_ERRO["campo_obrigatorio"].format(campo="usuario_id")
    
    if not data.get("consentimento"):
        return False, MENSAGENS_ERRO["consentimento_obrigatorio"]
    
    # Validação de usuario_id
    if not validar_object_id(data["usuario_id"]):
        return False, "ID de usuário inválido"
    
    # Validação de consentimento
    if data["consentimento"] is not True:
        return False, "Consentimento deve ser True"
    
    return True, None

def validar_login(data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """Valida dados para login"""
    
    # Campos obrigatórios
    campos_obrigatorios = ["email", "senha"]
    for campo in campos_obrigatorios:
        if not data.get(campo):
            return False, MENSAGENS_ERRO["campo_obrigatorio"].format(campo=campo)
    
    # Validação básica de email
    if not data["email"] or "@" not in data["email"]:
        return False, MENSAGENS_ERRO["email_invalido"]
    
    return True, None

def sanitizar_dados_cliente(data: Dict[str, Any]) -> Dict[str, Any]:
    """Sanitiza e formata dados do cliente"""
    
    dados_limpos = {}
    
    # Campos de texto - remover espaços extras
    campos_texto = ["primeiro_nome", "sobrenome", "nome_social", "telefone", "genero"]
    for campo in campos_texto:
        if campo in data and data[campo]:
            dados_limpos[campo] = data[campo].strip()
    
    # CPF - remover caracteres especiais
    if "cpf" in data:
        dados_limpos["cpf"] = re.sub(r'[^0-9]', '', data["cpf"])
    
    # Data de nascimento - converter para date
    if "data_nascimento" in data:
        if isinstance(data["data_nascimento"], str):
            dados_limpos["data_nascimento"] = datetime.strptime(
                data["data_nascimento"], "%Y-%m-%d"
            ).date()
        else:
            dados_limpos["data_nascimento"] = data["data_nascimento"]
    
    # Campos que devem ser mantidos como estão
    campos_manter = ["usuario_id", "tenant_id", "status"]
    for campo in campos_manter:
        if campo in data:
            dados_limpos[campo] = data[campo]
    
    # Adicionar timestamps
    dados_limpos["data_atualizacao"] = datetime.now()
    if "data_criacao" not in dados_limpos:
        dados_limpos["data_criacao"] = datetime.now()
    
    return dados_limpos

def sanitizar_dados_usuario(data: Dict[str, Any]) -> Dict[str, Any]:
    """Sanitiza e formata dados do usuário"""
    
    dados_limpos = {}
    
    # Email - lowercase
    if "email" in data:
        dados_limpos["email"] = data["email"].lower().strip()
    
    # Senha - manter como está (será hasheada depois)
    if "senha" in data:
        dados_limpos["senha"] = data["senha"]
    
    # Campos que devem ser mantidos
    campos_manter = ["tipo_usuario", "consentimento", "tenant_id", "ativo"]
    for campo in campos_manter:
        if campo in data:
            dados_limpos[campo] = data[campo]
    
    # Adicionar timestamps
    dados_limpos["data_atualizacao"] = datetime.now()
    if "data_criacao" not in dados_limpos:
        dados_limpos["data_criacao"] = datetime.now()
    
    return dados_limpos

def validar_tenant_por_subdomain(subdomain: str) -> Tuple[bool, Optional[str], Optional[str]]:
    """Valida e retorna tenant_id baseado no subdomain"""
    
    if not subdomain:
        return False, None, "Subdomain não informado"
    
    # Aqui você faria a consulta no banco para buscar o tenant
    # Por enquanto, retornamos o tenant padrão
    if subdomain in ["seenti", "localhost", "127.0.0.1"]:
        return True, "seenti", None
    
    return False, None, f"Tenant não encontrado para subdomain: {subdomain}"

# Função helper para extrair subdomain
def extrair_subdomain(request) -> str:
    """Extrai o subdomain da requisição"""
    host = request.headers.get('Host', '')
    
    # Para desenvolvimento local
    if 'localhost' in host or '127.0.0.1' in host:
        return 'seenti'
    
    # Para produção
    parts = host.split('.')
    if len(parts) >= 3:
        return parts[0]
    
    return 'seenti'  # fallback 