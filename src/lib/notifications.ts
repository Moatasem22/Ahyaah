// Notification Service for 'الهيئة - فرع تَعِز'
export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  date: string;
  read: boolean;
  url?: string;
}

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Use absolute path to ensure it's requested from the root
      const swUrl = '/service-worker.js';
      const registration = await navigator.serviceWorker.register(swUrl);
      console.log('Service Worker registered with scope:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

export const showLocalNotification = (title: string, body: string, icon?: string) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
      dir: 'rtl',
      lang: 'ar'
    });
  }
};

// Mock notifications for demo
export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    title: 'صرف المعاشات',
    body: 'تم البدء بصرف معاشات شهر مارس 2026 عبر مكاتب البريد.',
    type: 'SUCCESS',
    date: '2026-03-15',
    read: false
  },
  {
    id: '2',
    title: 'تحديث البيانات',
    body: 'يرجى تحديث بياناتك البنكية لضمان استمرار صرف المعاش.',
    type: 'WARNING',
    date: '2026-03-10',
    read: true
  },
  {
    id: '3',
    title: 'طلب جديد',
    body: 'تم استلام طلبك رقم #4567 بنجاح وهو قيد المراجعة.',
    type: 'INFO',
    date: '2026-03-05',
    read: true
  }
];
