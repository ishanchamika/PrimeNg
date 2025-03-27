import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

// **Define the bspBasicData Interface**
interface BspBasicData {
  id?: number;
  bspType: 'individual' | 'corporate';  // 1 = Individual, 2 = Corporate
  nic?: string;
  BR?: string;
  fullName: string;
  address: {
    permanent: { line1: string; line2: string; line3: string };
    mailing: { line1: string; line2: string; line3: string };
  };
  contact: { contactNo1: string; contactNo2?: string };
  email: string;
  businessName?: string;
}

// **Define the bspRelatedParty Interface**
interface BspRelatedParty {
  id?: number;
  userId: string;
  partyName: string;
  relationship: string;
  status: 'Active' | 'Inactive';
}

@Injectable({
  providedIn: 'root'
})
export class ChatUIindexdb {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  //__________Initialize IndexedDB_________________
  private async initDB() {
    return openDB('conversation', 2, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('bspBasic')) {
          db.createObjectStore('bspBasic', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('bspRelatedParty')) {
          db.createObjectStore('bspRelatedParty', { keyPath: 'id', autoIncrement: true });
        }
      }
    });
  }

//________________________________________________Handle bspBasic Data________________________________
  //__________Add bspBasic Data____________________
  async addBspBasicData(data: BspBasicData) {
    const db = await this.dbPromise;
    const tx = db.transaction('bspBasic', 'readwrite');
    const store = tx.objectStore('bspBasic');
    await store.add(data);
    await tx.done;
    console.log('bspBasic data added:', data);
  }

  //__________Get all bspBasic Data_________________
  async getBspBasicData(): Promise<BspBasicData[]> {
    const db = await this.dbPromise;
    return db.transaction('bspBasic').objectStore('bspBasic').getAll();
  }

  //__________Clear bspBasic Data____________________
  async clearBspBasicData() {
    const db = await this.dbPromise;
    await db.transaction('bspBasic', 'readwrite').objectStore('bspBasic').clear();
    console.log("Cleared bspBasic data!");
  }




//_______________________________________________Hnadle bspRelatedParty Data____________________________________________
  //__________Add bspRelatedParty Data_________________
  async addBspRelatedParty(data: BspRelatedParty) {
    const db = await this.dbPromise;
    const tx = db.transaction('bspRelatedParty', 'readwrite');
    const store = tx.objectStore('bspRelatedParty');
    await store.add(data);
    await tx.done;
    console.log('bspRelatedParty data added:', data);
  }

  //__________Get all bspRelatedParty Data_____________
  async getBspRelatedParty(): Promise<BspRelatedParty[]> {
    const db = await this.dbPromise;
    return db.transaction('bspRelatedParty').objectStore('bspRelatedParty').getAll();
  }

  //__________Clear bspRelatedParty Data_______________
  async clearBspRelatedParty() {
    const db = await this.dbPromise;
    await db.transaction('bspRelatedParty', 'readwrite').objectStore('bspRelatedParty').clear();
    console.log("Cleared bspRelatedParty data!");
  }




//___________________________________________________Handle Common Data________________________________________
  //__________Clear ALL Data_____________________
  async clearAllData() {
    const db = await this.dbPromise;
    const transaction = db.transaction(db.objectStoreNames, 'readwrite');
    for(const storeName of db.objectStoreNames) 
    {
      transaction.objectStore(storeName).clear();
    }
    await transaction.done;
    console.log("All IndexedDB data cleared!");
  }

  //___________Delete the IndexedDB______________
  async deleteDatabase() {
    indexedDB.deleteDatabase('conversation');
    console.log("Database 'conversation' deleted!");
  }
}
