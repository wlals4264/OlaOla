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

// DB에 파일 추가
export function addFileToDB(fileUrl: string, fileType: string): void {
  if (!db) {
    console.log('DB가 아직 준비되지 않았습니다.');
    return;
  }

  const transaction = db.transaction('mediaData', 'readwrite');
  const store = transaction.objectStore('mediaData');

  const fileData = {
    url: fileUrl,
    type: fileType,
    createdAt: new Date().toISOString(),
  };

  const addReq = store.add(fileData);

  addReq.addEventListener('success', function () {
    const target = event.target as IDBRequest;
    console.log('파일이 DB에 추가되었습니다.');
    console.log(target.result);
  });

  addReq.addEventListener('error', function (event) {
    const target = event.target as IDBRequest;
    console.error('파일 추가 오류 발생 : ', target?.error);
  });
}
