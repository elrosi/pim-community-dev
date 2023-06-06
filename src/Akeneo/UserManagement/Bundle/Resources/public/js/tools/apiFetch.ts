export class BadRequestError<T> extends Error {
  constructor(public readonly data: T) {
    super();
  }
}

export class ForbiddenError extends Error {}

export const apiFetch = async <T = void, E = unknown>(url: string, init: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  if (!response.ok) {
    switch (response.status) {
      case 400:
      case 422:
        throw new BadRequestError<E>(await response.json());
      case 403:
        throw new ForbiddenError();
      default:
        throw new Error(`${response.status} ${response.statusText}`);
    }
  }

  return await response.json();
};
