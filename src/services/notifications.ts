import { Notification } from '@types/index';

type NotificationCallback = (notification: Notification) => void;

class NotificationService {
  private eventSource: EventSource | null = null;
  private callbacks: NotificationCallback[] = [];
  private url: string;

  constructor(url: string = `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/notifications/stream`) {
    this.url = url;
  }

  subscribe(callback: NotificationCallback): () => void {
    this.callbacks.push(callback);
    
    if (!this.eventSource) {
      this.connect();
    }

    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
      if (this.callbacks.length === 0) {
        this.disconnect();
      }
    };
  }

  private connect(): void {
    if (this.eventSource) {
      return;
    }

    try {
      this.eventSource = new EventSource(this.url);

      this.eventSource.addEventListener('notification', (event: Event) => {
        const customEvent = event as MessageEvent;
        try {
          const notification = JSON.parse(customEvent.data) as Notification;
          this.notifySubscribers(notification);
        } catch (error) {
          console.error('Failed to parse notification:', error);
        }
      });

      this.eventSource.addEventListener('error', () => {
        console.error('EventSource connection error');
        this.disconnect();
        // Attempt reconnection after delay
        setTimeout(() => this.connect(), 5000);
      });
    } catch (error) {
      console.error('Failed to establish SSE connection:', error);
    }
  }

  private disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  private notifySubscribers(notification: Notification): void {
    this.callbacks.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification callback:', error);
      }
    });
  }

  closeConnection(): void {
    this.callbacks = [];
    this.disconnect();
  }
}

export const notificationService = new NotificationService();
