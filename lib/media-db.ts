'use client'

class MediaDB {
  private dbName = 'lb_media_store'
  private storeName = 'media'
  private version = 1

  private getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('IndexedDB is only available in browser environment'))
        return
      }
      const request = indexedDB.open(this.dbName, this.version)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName)
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async get(key: string): Promise<string> {
    try {
      const db = await this.getDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly')
        const store = transaction.objectStore(this.storeName)
        const request = store.get(key)
        request.onsuccess = () => resolve(request.result || '')
        request.onerror = () => reject(request.error)
      })
    } catch (e) {
      console.warn('IndexedDB get fallback:', e)
      return ''
    }
  }

  async set(key: string, val: string): Promise<void> {
    try {
      const db = await this.getDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite')
        const store = transaction.objectStore(this.storeName)
        const request = store.put(val, key)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (e) {
      console.error('IndexedDB set failed:', e)
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const db = await this.getDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite')
        const store = transaction.objectStore(this.storeName)
        const request = store.delete(key)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (e) {
      console.error('IndexedDB delete failed:', e)
    }
  }
}

export const mediaDB = new MediaDB()
