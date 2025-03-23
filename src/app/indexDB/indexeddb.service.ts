import { Injectable } from '@angular/core';
import  { openDB, IDBPDatabase } from 'idb';


interface CustomerData {
  id?: number;
  name: string;
  email: string;
  stepData: string; // Store JSON string or object
}

@Injectable({
  providedIn: 'root'
})

export class IndexeddbService
{
  private dbPromise: Promise<IDBPDatabase>;
  constructor() 
  {
    this.dbPromise = this.initDB();
  }

    //_____________Initialize IndexedDB______________
    public async initDB()
    {
      return openDB('chatRegistrationDB', 1, 
      {
        upgrade(db) 
        {
          if(!db.objectStoreNames.contains('customers')) 
          {
            db.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });
          }
        }
      });
    }

  //_______________Add data to IndexedDB________________
  async addCustomerData(data: CustomerData) {
    const db = await this.dbPromise;
    await db.transaction('customers', 'readwrite').objectStore('customers').add(data);
  }

  //_______________Get all stored data__________________
  async getAllCustomerData(): Promise<CustomerData[]> {
    const db = await this.dbPromise;
    return db.transaction('customers').objectStore('customers').getAll();
  }

  //_______________Delete all stored data_______________
  async clearAllCustomerData() {
    const db = await this.dbPromise;
    await db.transaction('customers', 'readwrite').objectStore('customers').clear();
  }

  //_______________Delete all stored data from all object stores_______________
  async clearAllData() {
    const db = await this.dbPromise;
    const transaction = db.transaction(db.objectStoreNames, 'readwrite'); // Get all stores
    for(const storeName of db.objectStoreNames) 
    {
        transaction.objectStore(storeName).clear(); // Clear each store
    }
    await transaction.done; // Wait until the transaction is completed
    console.log("All IndexedDB data cleared!");
  }


  //_______________Delete the database____________________
  async deleteDatabase() {
    // Close the database before deleting
    const dbName = 'chatRegistrationDB';
    indexedDB.deleteDatabase(dbName);
    console.log(`Database ${dbName} deleted`);
}
}
