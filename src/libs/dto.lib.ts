export interface IDto {
  data: any;
  status: number;
  error?: Error[];
}

const serverError = (message?: string, err?: Error[]): IDto => ({
  data: { message: message || "There was an error" },
  status: 500,
  error: err,
});

const badRequest = (message?: string, err?: Error[]): IDto => ({
  data: { message: message || "Bad request" },
  status: 400,
  error: err,
});

const notFound = (message?: string, err?: Error[]): IDto => ({
  data: { message: message || "Not found" },
  status: 404,
  error: err,
});

const forbidden = (message?: string, err?: Error[]): IDto => ({
  data: { message: message || "forbidden" },
  status: 403,
  error: err,
});

const authError = (message?: string): IDto => ({
  data: { message: message || "Authentication error" },
  status: 400,
});

const success = (data: any, message?: string): IDto => ({
  data: { message, ...data },
  status: 200,
});

const created = (data: any, message?: string): IDto => ({
  data: { message, ...data },
  status: 201,
});

export {
  serverError,
  badRequest,
  notFound,
  forbidden,
  authError,
  success,
  created,
};
