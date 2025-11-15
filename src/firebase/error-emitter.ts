
import { EventEmitter } from 'events';
import type { FirestorePermissionError } from './errors';

// This interface defines the types of events and their expected payloads.
interface TypedEvents {
  'permission-error': (error: FirestorePermissionError) => void;
}

class TypedEventEmitter<T extends Record<string, (...args: any[]) => void>> {
  private emitter = new EventEmitter();

  on<K extends keyof T>(event: K, listener: T[K]): void {
    this.emitter.on(event as string, listener);
  }

  off<K extends keyof T>(event: K, listener: T[K]): void {
    this.emitter.off(event as string, listener);
  }

  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
    this.emitter.emit(event as string, ...args);
  }
}

// Create a singleton instance of the typed event emitter.
// This will be used throughout the application to broadcast and listen for specific events.
export const errorEmitter = new TypedEventEmitter<TypedEvents>();
