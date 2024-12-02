let db: IDBDatabase | null = null;

// DB 초기화 함수
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
      if (!db.objectStoreNames.contains('mediaData')) {
        db.createObjectStore('mediaData', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('feedCommentData')) {
        db.createObjectStore('feedCommentData', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('postCommentData')) {
        db.createObjectStore('postCommentData', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('postData')) {
        db.createObjectStore('postData', { keyPath: 'id', autoIncrement: true });
      }
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

interface Comment {
  comment: string;
  userUID: string | null;
  ItemId: number;
  userNickName: string;
}

// 댓글 데이터를 DB에 추가
export function addCommentToDB(storeName: string, comment: Comment): Promise<Comment> {
  return new Promise((resolve, reject) => {
    getDB()
      .then((db) => {
        if (!db) {
          console.log('DB가 아직 준비되지 않았습니다.');
          reject('DB 연결 실패');
          return;
        }

        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        const addReq = store.add(comment);

        addReq.addEventListener('success', function (event: Event) {
          const target = event.target as IDBRequest;
          const commentWithId = { ...comment, id: addReq.result }; // 생성된 id를 포함
          resolve(commentWithId); // 성공적으로 댓글을 추가하고 id와 함께 반환
          console.log('댓글이 DB에 추가되었습니다.');
        });

        addReq.addEventListener('error', function (event) {
          const target = event.target as IDBRequest;
          console.error('댓글 추가 오류 발생 : ', target?.error);
          reject('댓글 추가 오류');
        });
      })
      .catch((error) => {
        console.error('DB 연결 오류:', error);
        reject('DB 연결 오류');
      });
  });
}

// DB에서 모든 댓글 리스트를 가져오기
export function getCommentsListFromDB(storeName: string): Promise<Comment[]> {
  return getDB().then((db) => {
    if (!db) {
      return Promise.reject('DB가 아직 준비되지 않았습니다.');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const fileList = request.result;
        if (fileList.length > 0) {
          resolve(fileList);
        } else {
          reject('댓글이 존재하지 않습니다. ');
        }
      };

      request.onerror = (event) => {
        console.error('댓글 가져오기 오류', event);
        reject(event);
      };
    });
  });
}

// DB에서 댓글 삭제하는 함수
export function deleteCommentInDB(storeName: string, id: number): Promise<void> {
  return getDB().then((db) => {
    if (!db) {
      return Promise.reject('DB not available');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        console.log('댓글이 성공적으로 삭제되었습니다.');
        resolve();
      };

      request.onerror = (event) => {
        console.error('댓글 삭제 오류', event);
        reject(event);
      };
    });
  });
}

// ---------------------------
// postData store 접근 함수들
// ---------------------------

interface Post {
  userUID: string | null;
  userNickName: string;
  attachments: File;
  title: string;
  content: string;
  level: string;
  likeCount: number | 0;
  viewCount: number | 0;
  updatedAt: Date;
  centerName: string;
  type: string | null;
}

// DB에 게시글 올리기
export function addPostToDB(post: Post): void {
  getDB()
    .then((db) => {
      if (!db) {
        console.log('DB가 아직 준비되지 않았습니다.');
        return;
      }

      const transaction = db.transaction('postData', 'readwrite');
      const store = transaction.objectStore('postData');

      // const postData = {
      //   UID: userUID,
      //   userNickName: userNickName,
      //   attachments: attachments,
      //   level: level,
      //   centerName: centerName,
      //   likeCount: likeCount,
      //   viewCount: viewCount,
      //   createdAt: new Date().toISOString(),
      //   updatedAt: updatedAt.toISOString(),
      //   title: title,
      //   content: content,
      // };

      const addReq = store.add(post);

      addReq.addEventListener('success', function (event: Event) {
        const target = event.target as IDBRequest;
        console.log('게시글이 DB에 추가되었습니다.');
        console.log(target.result);
      });

      addReq.addEventListener('error', function (event) {
        const target = event.target as IDBRequest;
        console.error('게시글 추가 오류 발생 : ', target?.error);
      });
    })
    .catch((error) => {
      console.error('DB 연결 오류:', error);
    });
}

// DB에서 게시글 가져오기
export function getPostFromDB(postId: number): Promise<void> {
  return getDB().then((db) => {
    if (!db) {
      return Promise.reject('DB not available');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('postData', 'readonly');
      const objectStore = transaction.objectStore('postData');
      const request = objectStore.get(postId);

      request.onsuccess = () => {
        const postData = request.result;
        if (postData) {
          resolve(postData);
        } else {
          reject('게시글을 찾을 수 없습니다.');
        }
      };

      request.onerror = (event) => {
        console.error('게시글 가져오기 오류', event);
        reject(event);
      };
    });
  });
}

// DB에서 모든 파일 리스트를 가져오기
export function getPostListFromDB(): Promise<File[]> {
  return getDB().then((db) => {
    if (!db) {
      return Promise.reject('DB not available');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('postData', 'readonly');
      const objectStore = transaction.objectStore('postData');
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const postList = request.result;
        if (postList.length > 0) {
          resolve(postList);
        } else {
          reject('게시글이 존재하지 않습니다. ');
        }
      };

      request.onerror = (event) => {
        console.error('게시글 가져오기 오류', event);
        reject(event);
      };
    });
  });
}

// DB 파일 수정 함수
export function updatePostInDB(
  postId: number,
  updatedData: {
    centerName: string;
    attachments?: File;
    viewCount?: number;
    likeCount?: number;
    content?: string;
    level?: string;
  }
): Promise<void> {
  return getDB().then((db) => {
    if (!db) {
      return Promise.reject('DB not available');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('postData', 'readwrite');
      const objectStore = transaction.objectStore('postData');
      const request = objectStore.get(postId);

      request.onsuccess = () => {
        const postData = request.result;
        if (postData) {
          const updatedPostData = { ...postData, ...updatedData };
          const updateReq = objectStore.put(updatedPostData);

          updateReq.onsuccess = () => {
            console.log('게시글이 성공적으로 업데이트되었습니다.');
            resolve();
          };

          updateReq.onerror = (event) => {
            console.error('게시글 수정 오류', event);
            reject(event);
          };
        } else {
          reject('게시글을 찾을 수 없습니다.');
        }
      };

      request.onerror = (event) => {
        console.error('게시글 가져오기 오류', event);
        reject(event);
      };
    });
  });
}

// DB 파일 삭제 함수
export function deletePostInDB(postId: number): Promise<void> {
  return getDB().then((db) => {
    if (!db) {
      return Promise.reject('DB not available');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('postData', 'readwrite');
      const objectStore = transaction.objectStore('postData');
      const request = objectStore.delete(postId);

      request.onsuccess = () => {
        console.log('게시글이 성공적으로 삭제되었습니다.');
        resolve();
      };

      request.onerror = (event) => {
        console.error('게시글 삭제 오류', event);
        reject(event);
      };
    });
  });
}
