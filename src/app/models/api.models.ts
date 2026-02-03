// ========== AUTH MODELS ==========
export interface LoginRequest {
  re: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  usuarioId: number;
  re: string;
  nomeCompleto: string;
  perfil: Perfil;
}

// ========== ENUMS ==========
export enum Perfil {
  OPERADOR = 'OPERADOR',
  SUPERVISOR = 'SUPERVISOR',
  ADMIN = 'ADMIN'
}

export enum Turno {
  A = 'A',
  B = 'B',
  C = 'C'
}

export enum TipoItem {
  CONFORME = 'CONFORME',
  IMPEDITIVO = 'IMPEDITIVO'
}

export enum StatusItem {
  OK = 'OK',
  NAO_CONFORME = 'NAO_CONFORME'
}

export enum ResultadoChecklist {
  APROVADO = 'APROVADO',
  REPROVADO = 'REPROVADO'
}

// ========== USUARIO ==========
export interface UsuarioResponse {
  id: number;
  re: string;
  nomeCompleto: string;
  perfil: Perfil;
  ativo: boolean;
}

export interface UsuarioRequest {
  re: string;
  nomeCompleto: string;
  senha: string;
  perfil: Perfil;
}

// ========== EMPILHADEIRA ==========
export interface EmpilhadeiraResponse {
  id: number;
  modelo: string;
  tipo: string;
  capacidade: number;
  bloqueada: boolean;
  motivoBloqueio?: string;
  ativa: boolean;
}

export interface EmpilhadeiraRequest {
  modelo: string;
  tipo: string;
  capacidade: number;
}

export interface BloquearEmpilhadeiraRequest {
  motivo: string;
}

// ========== CHECKLIST ==========
export interface ChecklistRequest {
  data: string; // formato: YYYY-MM-DD
  horaVistoria: string; // formato: HH:mm:ss
  turno: Turno;
  horimetroInicial: number;
  horimetroFinal?: number;
  operadorId: number;
  empilhadeiraId: number;
  itens: ItemChecklistRequest[];
  observacaoGeral?: string;
}

export interface ItemChecklistRequest {
  descricao: string;
  tipo: TipoItem;
  status: StatusItem;
  observacao?: string;
}

export interface ChecklistResponse {
  id: number;
  data: string;
  diaSemana: string;
  horaVistoria: string;
  turno: Turno;
  horimetroInicial: number;
  horimetroFinal?: number;
  operador: UsuarioResponse;
  empilhadeira: EmpilhadeiraResponse;
  resultado: ResultadoChecklist;
  itens: ItemChecklistResponse[];
  observacaoGeral?: string;
}

export interface ItemChecklistResponse {
  id: number;
  descricao: string;
  tipo: TipoItem;
  status: StatusItem;
  observacao?: string;
}

// ========== ERROR RESPONSE ==========
export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  details?: { [key: string]: string };
}
