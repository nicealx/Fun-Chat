export const SERVER_URL = 'ws://localhost:4000';
const reg = '([^]+(?=\\?))';
export const PATH = window.location.href.replace(new RegExp(reg), '');
