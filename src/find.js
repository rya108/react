import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

function FindUserPage() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCol = collection(db, 'tasks');
      const userSnapshot = await getDocs(usersCol);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
      setFilteredUsers(userList);
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const kw = e.target.value;
    setKeyword(kw);
    setFilteredUsers(users.filter(user => user.name.toLowerCase().includes(kw.toLowerCase())));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-center p-6">
      <h2 className="text-xl font-bold mb-4">タスク検索</h2>
      <input
        className="border p-2 rounded w-64"
        type="text"
        placeholder="タスク名で検索"
        value={keyword}
        onChange={handleSearch}
      />
      <ul className="mt-6">
        {filteredUsers.map(user => (
          <li key={user.id} className="bg-white shadow-md p-4 rounded mb-2 w-64 mx-auto">
            {user.name} - {user.mail} - {user.date} - {user.dorm ? "完了" : "未完了"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FindUserPage;
