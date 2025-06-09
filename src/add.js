import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';

function AddUser() {
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [date, setDate] = useState('');
  const [dorm, setDorm] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'tasks'), {
        name,
        mail,
        date,
        dorm
      });
      alert('タスクを追加しました');
      navigate('/');
    } catch (error) {
      alert('追加に失敗しました: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-center text-xl font-bold mb-4">タスク追加</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">タスク名：</label>
            <input
              className="border w-full p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">説明：</label>
            <input
              className="border w-full p-2 rounded"
              type="text"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">日付：</label>
            <input
              className="border w-full p-2 rounded"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <button className="w-full p-2 bg-blue-500 text-white rounded" type="submit">
            追加
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
