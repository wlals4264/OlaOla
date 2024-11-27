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
export const getDB = (): Promise<IDBDatabase | null> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('YourDatabaseName', 1);

    request.onsuccess = () => {
      const db = request.result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject(new Error('IndexedDB 연결 실패'));
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('YourObjectStore')) {
        db.createObjectStore('YourObjectStore', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

// DB에 파일 추가
export function addFileToDB(
  file: File,
  fileType: string,
  describe: string,
  userUID: string | null,
  level: string,
  centerName: string
): void {
  if (!db) {
    console.log('DB가 아직 준비되지 않았습니다.');
    return;
  }

  const transaction = db.transaction('mediaData', 'readwrite');
  const store = transaction.objectStore('mediaData');

  const fileData = {
    file: file,
    type: fileType,
    describe: describe,
    UID: userUID,
    level: level,
    centerName: centerName,
    createdAt: new Date().toISOString(),
  };

  const addReq = store.add(fileData);

  addReq.addEventListener('success', function (event: Event) {
    const target = event.target as IDBRequest;
    console.log('파일이 DB에 추가되었습니다.');
    console.log(target.result);
  });

  addReq.addEventListener('error', function (event) {
    const target = event.target as IDBRequest;
    console.error('파일 추가 오류 발생 : ', target?.error);
  });
}

// DB에서 파일을 가져오기
export function getFileFromDB(fileId: number): Promise<File | null> {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.log('DB가 아직 준비되지 않았습니다.');
      return reject('DB not available');
    }

    try {
      const transaction = db.transaction('mediaData', 'readonly');
      const objectStore = transaction.objectStore('mediaData');
      const request = objectStore.get(fileId); // 파일 ID로 검색

      request.onsuccess = () => {
        const fileData = request.result;
        if (fileData && fileData.file) {
          const file = fileData.file;
          resolve(file); // File 객체 반환
        } else {
          reject('파일을 찾을 수 없습니다.');
        }
      };

      request.onerror = (event) => {
        console.error('파일 가져오기 오류', event);
        reject(event);
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      reject(error);
    }
  });
}

// DB에서 모든 파일 리스트를 가져오기
export function getFileListFromDB(): Promise<File[]> {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.log('DB가 아직 준비되지 않았습니다.');
      return reject('DB not available');
    }

    try {
      const transaction = db.transaction('mediaData', 'readonly');
      const objectStore = transaction.objectStore('mediaData');
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const fileList = request.result;
        if (fileList.length > 0) {
          resolve(fileList);
        } else {
          reject('파일이 존재하지 않습니다.');
        }
      };

      request.onerror = (event) => {
        console.error('파일 가져오기 오류', event);
        reject(event);
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      reject(error);
    }
  });
}
