export function NotFoundError(message: string) {
  this.name = 'notFoundError';
  this.message = message;
}
