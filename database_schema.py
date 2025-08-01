"""
SCHEMA COMPLETO DO BANCO DE DADOS - SEENTI
Definição de todas as coleções e validações antes do desenvolvimento
"""

from datetime import datetime, date
from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum

# ============================================================================
# ENUMS E CONSTANTES
# ============================================================================

class TipoUsuario(str, Enum):
    CLIENTE = "C"
    TERAPEUTA = "T"
    ADMIN = "A"

class StatusCliente(str, Enum):
    ATIVO = "ativo"
    INATIVO = "inativo"
    PENDENTE = "pendente"

class StatusAnamnese(str, Enum):
    PENDENTE = "pendente"
    PREENCHIDA = "preenchida"
    BLOQUEADA = "bloqueada"

# ============================================================================
# SCHEMAS DAS COLEÇÕES
# ============================================================================

@dataclass
class SchemaUsuario:
    """Schema da coleção 'usuarios'"""
    _id: str  # ObjectId
    email: str  # único, validado
    senha: str  # hash bcrypt
    tipo_usuario: TipoUsuario  # C, T, A
    consentimento: bool  # LGPD
    tenant_id: str  # para multi-tenant
    data_criacao: datetime
    data_atualizacao: datetime
    ativo: bool = True
    
    # Validações
    @staticmethod
    def validar_email(email: str) -> bool:
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    @staticmethod
    def validar_senha(senha: str) -> bool:
        # Mínimo 8 caracteres, pelo menos 1 letra e 1 número
        return len(senha) >= 8 and any(c.isalpha() for c in senha) and any(c.isdigit() for c in senha)

@dataclass
class SchemaCliente:
    """Schema da coleção 'clientes'"""
    _id: str  # ObjectId
    usuario_id: str  # ObjectId referência
    primeiro_nome: str
    sobrenome: str
    cpf: str  # único, validado
    data_nascimento: date  # validar ≥18 anos
    telefone: str
    tenant_id: str  # para multi-tenant
    data_criacao: datetime
    data_atualizacao: datetime
    nome_social: Optional[str] = None  # opcional
    genero: Optional[str] = None
    status: StatusCliente = StatusCliente.PENDENTE
    
    # Validações
    @staticmethod
    def validar_cpf(cpf: str) -> bool:
        """Validação de CPF brasileiro"""
        import re
        # Remove caracteres não numéricos
        cpf = re.sub(r'[^0-9]', '', cpf)
        
        if len(cpf) != 11:
            return False
        
        # Verifica se todos os dígitos são iguais
        if cpf == cpf[0] * 11:
            return False
        
        # Validação dos dígitos verificadores
        for i in range(9, 11):
            value = sum((int(cpf[num]) * ((i + 1) - num) for num in range(0, i)))
            digit = ((value * 10) % 11) % 10
            if int(cpf[i]) != digit:
                return False
        return True
    
    @staticmethod
    def validar_idade(data_nascimento: date) -> bool:
        """Valida se a pessoa tem 18 anos ou mais"""
        hoje = date.today()
        idade = hoje.year - data_nascimento.year
        if hoje.month < data_nascimento.month or (hoje.month == data_nascimento.month and hoje.day < data_nascimento.day):
            idade -= 1
        return idade >= 18

@dataclass
class SchemaAnamnese:
    """Schema da coleção 'anamneses'"""
    _id: str  # ObjectId
    cliente_id: str  # ObjectId referência
    tenant_id: str  # para multi-tenant
    status: StatusAnamnese = StatusAnamnese.PENDENTE
    dados: Dict  # estrutura flexível mas validada
    data_criacao: datetime
    data_atualizacao: datetime
    data_preenchimento: Optional[datetime] = None
    
    # Estrutura esperada dos dados
    @staticmethod
    def get_estrutura_dados() -> Dict:
        return {
            "identificacao": {
                "nome_completo": str,
                "idade": int,
                "sexo": str,
                "profissao": str,
                "estado_civil": str,
                "escolaridade": str,
                "religiao": str
            },
            "queixa_principal": str,
            "historia_atual": str,
            "antecedentes_pessoais": str,
            "antecedentes_familiares": str,
            "medicamentos_atuais": List[str],
            "alergias": List[str],
            "habitos": {
                "alimentacao": str,
                "sono": str,
                "exercicios": str,
                "tabagismo": str,
                "alcool": str
            },
            "exame_fisico": str,
            "observacoes": str
        }

@dataclass
class SchemaTenant:
    """Schema da coleção 'tenants' (White Label)"""
    _id: str  # ObjectId
    codigo: str  # único, usado no subdomain
    nome: str
    razao_social: str
    cnpj: str  # único, validado
    email_contato: str
    telefone: str
    endereco: Dict
    configuracoes_visuais: Dict  # cores, logo, fontes
    ativo: bool = True
    data_criacao: datetime
    data_atualizacao: datetime
    
    @staticmethod
    def get_estrutura_configuracoes() -> Dict:
        return {
            "cores": {
                "primaria": str,  # hex color
                "secundaria": str,  # hex color
                "texto": str,  # hex color
                "fundo": str  # hex color
            },
            "logo": {
                "url": str,
                "altura": int,
                "largura": int
            },
            "fonte": {
                "familia": str,
                "tamanho_base": int
            },
            "textos": {
                "nome_plataforma": str,
                "slogan": str,
                "termo_uso": str
            }
        }

@dataclass
class SchemaTermoUso:
    """Schema da coleção 'termos_uso'"""
    _id: str  # ObjectId
    tenant_id: str  # ObjectId referência
    versao: str  # ex: "1.0.0"
    titulo: str
    conteudo: str
    ativo: bool = True
    data_criacao: datetime
    data_atualizacao: datetime

# ============================================================================
# ÍNDICES NECESSÁRIOS
# ============================================================================

INDICES_MONGODB = {
    "usuarios": [
        {"email": 1, "tenant_id": 1},  # único por tenant
        {"tenant_id": 1},
        {"tipo_usuario": 1}
    ],
    "clientes": [
        {"cpf": 1, "tenant_id": 1},  # único por tenant
        {"usuario_id": 1},  # único
        {"tenant_id": 1}
    ],
    "anamneses": [
        {"cliente_id": 1},  # único por cliente
        {"tenant_id": 1},
        {"status": 1}
    ],
    "tenants": [
        {"codigo": 1},  # único
        {"cnpj": 1}  # único
    ],
    "termos_uso": [
        {"tenant_id": 1, "ativo": 1},
        {"versao": 1}
    ]
}

# ============================================================================
# VALIDAÇÕES GLOBAIS
# ============================================================================

def validar_tenant_id(tenant_id: str) -> bool:
    """Valida se o tenant_id existe e está ativo"""
    # Implementar verificação no banco
    return bool(tenant_id and len(tenant_id) == 24)

def validar_object_id(object_id: str) -> bool:
    """Valida se é um ObjectId válido do MongoDB"""
    import re
    pattern = r'^[0-9a-fA-F]{24}$'
    return bool(re.match(pattern, object_id))

# ============================================================================
# MENSAGENS DE ERRO PADRONIZADAS
# ============================================================================

MENSAGENS_ERRO = {
    "campo_obrigatorio": "Campo '{campo}' é obrigatório",
    "email_invalido": "Formato de email inválido",
    "email_ja_cadastrado": "Email já cadastrado",
    "senha_fraca": "Senha deve ter pelo menos 8 caracteres, 1 letra e 1 número",
    "cpf_invalido": "CPF inválido",
    "cpf_ja_cadastrado": "CPF já cadastrado",
    "idade_insuficiente": "É necessário ter 18 anos ou mais",
    "tenant_inexistente": "Clínica não encontrada",
    "usuario_inexistente": "Usuário não encontrado",
    "cliente_inexistente": "Cliente não encontrado",
    "anamnese_ja_preenchida": "Anamnese já foi preenchida",
    "consentimento_obrigatorio": "Aceite do termo de uso é obrigatório"
} 