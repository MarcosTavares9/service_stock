export class ValidationUtil {
  static async checkUnique<T>(
    repository: { findByEmail?: (email: string) => Promise<T | null>; findByName?: (name: string) => Promise<T | null> },
    value: string,
    field: 'email' | 'name',
    excludeId?: string | number,
  ): Promise<void> {
    let existing: T | null = null;

    if (field === 'email' && repository.findByEmail) {
      existing = await repository.findByEmail(value);
    } else if (field === 'name' && repository.findByName) {
      existing = await repository.findByName(value);
    }

    if (existing) {
      const existingId = (existing as any).id;
      if (!excludeId || existingId !== excludeId) {
        throw new Error(`${field === 'email' ? 'Email' : 'Nome'} já cadastrado`);
      }
    }
  }

  static parseBoolean(value: string | undefined): boolean | undefined {
    if (value === undefined) return undefined;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  }
}

