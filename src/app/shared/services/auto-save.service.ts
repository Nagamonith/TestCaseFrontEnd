// src/app/shared/services/auto-save.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AutoSaveService {
  private intervalId: any = null;
  private enabled = true;
  private intervalMs = 3000;
  private callbackFn: () => void = () => {};

  start(callback: () => void) {
    this.callbackFn = callback;
    this.stop();
    if (this.enabled) {
      this.intervalId = setInterval(callback, this.intervalMs);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setEnabled(value: boolean) {
    this.enabled = value;
  }

  setInterval(ms: number) {
    this.intervalMs = ms;
    if (this.enabled && this.callbackFn) {
      this.start(this.callbackFn);
    }
  }
}
