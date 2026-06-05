import jwt from 'jsonwebtoken';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export function generateJWT(payload: Record<string, any>, expiresIn: string = '7d'): string {
  const secret = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production';
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

export function verifyJWT<T = any>(token: string): T | null {
  try {
    const secret = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production';
    return jwt.verify(token, secret) as T;
  } catch {
    return null;
  }
}

export function successResponse<T>(
  message: string,
  data?: T,
  statusCode = 200
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    statusCode,
  };
}

export function errorResponse(
  message: string,
  error?: string,
  statusCode = 400
): ApiResponse {
  return {
    success: false,
    message,
    error: error || message,
    statusCode,
  };
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: any) {
  if (error instanceof ApiError) {
    return errorResponse(error.message, error.details?.toString(), error.statusCode);
  }

  if (error instanceof Error) {
    return errorResponse(error.message, error.stack, 500);
  }

  return errorResponse('An unexpected error occurred', undefined, 500);
}
