import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

@Injectable({
  providedIn: 'root'
})
export class ChatUIindexdb {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  async initDB() {
    return openDB('ChatDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('customer_inputs')) {
          db.createObjectStore('customer_inputs', { keyPath: 'key' });
        }
      }
    });
  }
  async addData(storeName: string, data: { key: string; value: string }) {
    const db = await this.dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    
    // If the value is an object, stringify it before saving
    if (typeof data.value === 'object') {
      data.value = JSON.stringify(data.value);
    }
  
    await store.put(data);
    await tx.done;
  }
  

  async getData(storeName: string, key: string) {
    const db = await this.dbPromise;
    return db.transaction(storeName).objectStore(storeName).get(key);
  }
}
