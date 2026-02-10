/**
 * Enum para controle de status das entidades
 * - true: Ativo
 * - false: Desativado
 * - blocked: Excluído (soft delete)
 */
export enum EntityStatus {
  ACTIVE = 'true',
  INACTIVE = 'false',
  BLOCKED = 'blocked',
}
