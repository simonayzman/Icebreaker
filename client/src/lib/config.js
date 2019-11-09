export const CONFIG = window.config || {
  token: 'Hello DEV Flask',
  api: 'http://localhost',
  port: 8000,
};
export const API = `${CONFIG.api}:${CONFIG.port}`;
