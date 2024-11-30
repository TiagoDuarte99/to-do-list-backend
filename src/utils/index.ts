import bcrypt from 'bcryptjs';

/**
 * Gera o hash de uma senha.
 * @param password - Senha a ser criptografada.
 * @returns Hash da senha.
 */
export const getPasswdHash = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

/**
 * Valida se um email tem um formato válido.
 * @param email - Email a ser validado.
 * @returns `true` se o email for válido, caso contrário `false`.
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida se uma senha atende aos critérios de segurança.
 * @param password - Senha a ser validada.
 * @returns `true` se a senha for válida, caso contrário `false`.
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Compara uma senha em texto plano com um hash armazenado.
 * @param password - Senha em texto plano.
 * @param hash - Hash armazenado.
 * @returns `true` se a senha corresponder ao hash, caso contrário `false`.
 */
export const comparePassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};
