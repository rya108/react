import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

function DeleteUser() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCol = collection(db, 'tasks');
      const userSnapshot = await getDocs(usersCol);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('本当にこのタスクを削除しますか？')) return;
    
    try {
      await deleteDoc(doc(db, 'tasks', id));
      setUsers(users.filter(user => user.id !== id));
      alert('タスクを削除しました');
    } catch (error) {
      alert('削除に失敗しました: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-center p-6">
      <h2 className="text-xl font-bold mb-4">タスク削除</h2>
      <ul className="mt-6">
        {users.map(user => (
          <li key={user.id} className="bg-white shadow-md p-4 rounded mb-2 w-64 mx-auto flex justify-between">
            <div>{user.name} - {user.mail} - {user.date} - {user.dorm ? "完了" : "未完了"}</div>
            <button className="p-2 bg-red-500 text-white rounded" onClick={() => deleteUser(user.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeleteUser;
