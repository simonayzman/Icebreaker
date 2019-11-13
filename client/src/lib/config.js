export const CONFIG = window.config || {
  token: '((( DEFAULT DEV ENV )))',
  api: 'http://localhost',
  port: 8000,
};
export const API = `${CONFIG.api}${CONFIG.port ? `:${CONFIG.port}` : ''}`;
