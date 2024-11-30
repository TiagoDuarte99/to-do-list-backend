export function ForbiddenError(message: string) {
  this.name = 'forbiddenError';
  this.message = message;
}
