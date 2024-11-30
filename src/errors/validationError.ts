export function ValidationError(message: string) {
  this.name = 'validationError';
  this.message = message;
}
