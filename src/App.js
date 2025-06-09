import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import AddUser from './add';
import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import DeleteUser from './delete';
import FindUser from './find';
import { db, auth, provider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null); // Firebaseユーザー
  const [dbUsers, setdbUsers] = useState([]); // Firestoreのデータ（ToDoリスト）

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCol = collection(db, 'tasks'); // 🔧 "mydata" → "tasks"
      const userSnapshot = await getDocs(usersCol);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setdbUsers(userList);
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    fetchUsers();
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("ログインエラー :", error.code, error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("ログアウトエラー :", error);
    }
  };

  // 🔧 タスクの「完了」状態を更新
  const markAsCompleted = async (taskId) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { dorm: true });

      setdbUsers(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, dorm: true } : task
        )
      );
    } catch (error) {
      console.error("完了処理エラー: ", error);
    }
  };

  return (
    <Router>
      <Navigation />
      <div className="p-4 flex justify-end bg-gray-100">
        {user ? (
          <div>
            <span className="mr-4">こんにちは、 {user.displayName} さん</span>
            <button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded">ログアウト</button>
          </div>
        ) : (
          <button onClick={handleLogin} className="p-2 bg-blue-500 text-white rounded">Googleでログイン</button>
        )}
      </div>

      <Routes>
        <Route path="/" element={
          <div>
            <h1 className="text-center p-6">ToDoリスト</h1>
            <table className="border border-blue-400 shadow-md rounded-lg mx-auto">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-4 py-2 border border-blue-400">タスク名</th>
                  <th className="px-4 py-2 border border-blue-400">説明</th>
                  <th className="px-4 py-2 border border-blue-400">日付</th>
                  <th className="px-4 py-2 border border-blue-400">状態</th>
                  <th className="px-4 py-2 border border-blue-400">操作</th>
                </tr>
              </thead>
              {user ? (
                <tbody>
                  {dbUsers.map(user => (
                    <tr key={user.id} className='border-b-2 border-gray-400'>
                      <td className='p-4'>{user.name}</td>
                      <td className='p-4'>{user.mail}</td>
                      <td className='p-4'>{user.date}</td> {/* 🔧 日付を表示 */}
                      <td className='p-4'>{user.dorm ? "完了" : "未完了"}</td>
                      <td className='p-4'>
                        {!user.dorm && (
                          <button
                            onClick={() => markAsCompleted(user.id)}
                            className="p-2 bg-green-500 text-white rounded"
                          >
                            完了
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr><th colSpan={5} className="text-gray-600 mt-4">ログインするとタスクが見られます。</th></tr>
                </tbody>
              )}
            </table>
          </div>
        } />

        {user ? (
          <>
            <Route path="/add" element={<AddUser />} />
            <Route path="/delete" element={<DeleteUser />} />
            <Route path="/find" element={<FindUser />} />
          </>
        ) : (
          <>
            <Route path="/add" element={<p>ログインしてください</p>} />
            <Route path="/delete" element={<p>ログインしてください</p>} />
            <Route path="/find" element={<p>ログインしてください</p>} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
