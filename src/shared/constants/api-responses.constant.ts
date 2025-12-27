export const ApiResponses = {
  created: (description: string = 'Recurso criado com sucesso') => ({
    status: 201,
    description,
  }),
  ok: (description: string = 'Operação realizada com sucesso') => ({
    status: 200,
    description,
  }),
  notFound: (resource: string = 'Recurso') => ({
    status: 404,
    description: `${resource} não encontrado`,
  }),
  badRequest: (description: string = 'Erro na requisição') => ({
    status: 400,
    description,
  }),
  unauthorized: (description: string = 'Não autorizado') => ({
    status: 401,
    description,
  }),
  conflict: (description: string = 'Conflito') => ({
    status: 409,
    description,
  }),
};

