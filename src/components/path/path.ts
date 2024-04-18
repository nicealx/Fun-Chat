export default function PATH() {
  return window.location.href.replace(/([^]+(?=\?))/, '');
}
