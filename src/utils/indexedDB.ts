let db: IDBDatabase | null = null;

// DB 초기화 함수
export function initDB() {
  if (db) {
    console.log('DB is already initialized');
    return;
  }

  const dbReq: IDBOpenDBRequest = indexedDB.open('database', 2);

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

    if (oldVersion < 2) {
      db.createObjectStore('mediaData', { keyPath: 'id', autoIncrement: true });
    }

    if (oldVersion < 2) {
      db.createObjectStore('commentData', { keyPath: 'id', autoIncrement: true });
    }
  });
}

// DB 가져와서 셋팅
export const getDB = (): Promise<IDBDatabase | null> => {
  if (db) {
    return Promise.resolve(db);
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('database', 2);

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
      if (!db.objectStoreNames.contains('mediaData')) {
        db.createObjectStore('mediaData', { keyPath: 'id', autoIncrement: true });
      }

      if (!db.objectStoreNames.contains('commentData')) {
        db.createObjectStore('commentData', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

// ---------------------------
// mediaData store 접근 함수들
// ---------------------------
// DB에 파일 추가
export function addFileToDB(
  file: File,
  fileType: string,
  describe: string,
  userUID: string | null,
  level: string,
  centerName: string,
  niceCount: number = 0
): void {
  getDB()
    .then((db) => {
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
        niceCount: niceCount,
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
    })
    .catch((error) => {
      console.error('DB 연결 오류:', error);
    });
}

// DB에서 파일을 가져오기
export function getFileFromDB(fileId: number): Promise<File | null> {
  return getDB().then((db) => {
    if (!db) {
      return Promise.reject('DB not available');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('mediaData', 'readonly');
      const objectStore = transaction.objectStore('mediaData');
      const request = objectStore.get(fileId);

      request.onsuccess = () => {
        const fileData = request.result;
        if (fileData) {
          resolve(fileData);
        } else {
          reject('파일을 찾을 수 없습니다.');
        }
      };

      request.onerror = (event) => {
        console.error('파일 가져오기 오류', event);
        reject(event);
      };
    });
  });
}

// DB에서 모든 파일 리스트를 가져오기
export function getFileListFromDB(): Promise<File[]> {
  return getDB().then((db) => {
    if (!db) {
      return Promise.reject('DB not available');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('mediaData', 'readonly');
      const objectStore = transaction.objectStore('mediaData');
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const fileList = request.result;
        if (fileList.length > 0) {
          resolve(fileList);
        } else {
          reject('파일이 존재하지 않습니다. ');
        }
      };

      request.onerror = (event) => {
        console.error('파일 가져오기 오류', event);
        reject(event);
      };
    });
  });
}

// DB 파일 수정 함수
export function updateFileInDB(
  fileId: number,
  updatedData: { niceCount: number; describe?: string; level?: string; centerName?: string }
): Promise<void> {
  return getDB().then((db) => {
    if (!db) {
      return Promise.reject('DB not available');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('mediaData', 'readwrite');
      const objectStore = transaction.objectStore('mediaData');
      const request = objectStore.get(fileId);

      request.onsuccess = () => {
        const fileData = request.result;
        if (fileData) {
          const updatedFileData = { ...fileData, ...updatedData };
          const updateReq = objectStore.put(updatedFileData);

          updateReq.onsuccess = () => {
            console.log('파일이 성공적으로 업데이트되었습니다.');
            resolve();
          };

          updateReq.onerror = (event) => {
            console.error('파일 수정 오류', event);
            reject(event);
          };
        } else {
          reject('파일을 찾을 수 없습니다.');
        }
      };

      request.onerror = (event) => {
        console.error('파일 가져오기 오류', event);
        reject(event);
      };
    });
  });
}

// DB 파일 삭제 함수
export function deleteFileInDB(fileId: number): Promise<void> {
  return getDB().then((db) => {
    if (!db) {
      return Promise.reject('DB not available');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('mediaData', 'readwrite');
      const objectStore = transaction.objectStore('mediaData');
      const request = objectStore.delete(fileId);

      request.onsuccess = () => {
        console.log('파일이 성공적으로 삭제되었습니다.');
        resolve();
      };

      request.onerror = (event) => {
        console.error('파일 삭제 오류', event);
        reject(event);
      };
    });
  });
}

// ---------------------------
// commentData store 접근 함수들
// ---------------------------
// 댓글 데이터를 DB에 추가
export function addCommentToDB(
  commentText: string,
  userUID: string | null,
  feedItemId: number,
  userNickName: string
): void {
  getDB()
    .then((db) => {
      if (!db) {
        console.log('DB가 아직 준비되지 않았습니다.');
        return;
      }

      const transaction = db.transaction('commentData', 'readwrite');
      const store = transaction.objectStore('commentData');

      const commentData = {
        comment: commentText,
        UID: userUID,
        feedItemId: feedItemId,
        userNickName: userNickName,
        createdAt: new Date().toISOString(),
      };

      const addReq = store.add(commentData);

      addReq.addEventListener('success', function (event: Event) {
        const target = event.target as IDBRequest;
        console.log('댓글이 DB에 추가되었습니다.');
        console.log(target.result);
      });

      addReq.addEventListener('error', function (event) {
        const target = event.target as IDBRequest;
        console.error('댓글 추가 오류 발생 : ', target?.error);
      });
    })
    .catch((error) => {
      console.error('DB 연결 오류:', error);
    });
}

// DB에서 모든 댓글 리스트를 가져오기
export function getCommentsListFromDB(): Promise<Array<{ userNickName: string; comment: string; UID: string | null }>> {
  return getDB().then((db) => {
    if (!db) {
      return Promise.reject('DB not available');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('commentData', 'readonly');
      const objectStore = transaction.objectStore('commentData');
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const fileList = request.result;
        if (fileList.length > 0) {
          resolve(fileList);
        } else {
          reject('파일이 존재하지 않습니다. ');
        }
      };

      request.onerror = (event) => {
        console.error('파일 가져오기 오류', event);
        reject(event);
      };
    });
  });
}

// DB에서 댓글 삭제하는 함수
export function deleteCommentInDB(id: number): Promise<void> {
  return getDB().then((db) => {
    if (!db) {
      return Promise.reject('DB not available');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('commentData', 'readwrite');
      const objectStore = transaction.objectStore('commentData');
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        console.log('파일이 성공적으로 삭제되었습니다.');
        resolve();
      };

      request.onerror = (event) => {
        console.error('파일 삭제 오류', event);
        reject(event);
      };
    });
  });
}
