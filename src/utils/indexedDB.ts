let db: IDBDatabase | null = null;

export function initDB() {
  if (db) {
    console.log('DB is already initialized');
    return;
  }

  const dbReq: IDBOpenDBRequest = indexedDB.open('database', 1);

  dbReq.addEventListener('success', function (event: Event) {
    console.log('Database initialized successfully');
    const target = event.target as IDBOpenDBRequest;
    db = target.result;
  });

  dbReq.addEventListener('error', function (event: Event) {
    const error = (event.target as IDBOpenDBRequest).error;
    console.log('Error initializing database', error?.name);
  });

  dbReq.addEventListener('upgradeneeded', function (event: Event) {
    const target = event.target as IDBOpenDBRequest;
    console.log('Upgrading database');
    db = target.result;
    const oldVersion = event.oldVersion;

    if (oldVersion < 1) {
      db.createObjectStore('mediaData', { keyPath: 'id', autoIncrement: true });
    }
  });
}

// 데이터베이스 연결 확인 함수
export function getDB(): IDBDatabase | null {
  return db;
}
