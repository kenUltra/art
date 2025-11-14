export const NotificationCenter = (
  title: string,
  content?: string,
  tag?: string,
  pathTag?: string
) => {
  const ops: NotificationOptions = {
    lang: 'en-US',
    silent: false,
    tag: tag,
    icon: '/Art_logo.webp',
    body: content,
    badge: '/Art_logo.webp',
  };
  const mainNotification = new Notification(title, ops);
  mainNotification.addEventListener('click', (e: Event) => {
    document.location.href = document.location.origin + (pathTag ?? '/home');
  });
  mainNotification.addEventListener('error', (event: Event) => {
    document.location.href = document.location.origin + '/not-found';
  });
};
