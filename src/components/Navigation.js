// src/components/Navigation.js
import { Link } from 'react-router-dom';
import { FcManager, FcFullTrash ,FcDataRecovery,FcSearch } from "react-icons/fc"; // ← 使い䛯いアイコンをインポート
function Navigation() {
return (
<nav className="bg-gray-100 pt-6 text-center">
<Link to="/"><FcManager style={{ display:'inline-block', marginRight: '5px' }} />タスク一覧</Link> |
<Link to="/add"><FcDataRecovery style={{ display:'inline-block', marginRight: '5px' }} />タスク追加 </Link> |
<Link to="/delete"><FcFullTrash style={{ display:'inline-block', marginRight: '5px' }} />タスク削除 </Link> |
<Link to="/find"><FcSearch style={{ display:'inline-block', marginRight: '5px' }} />検索</Link>
</nav>
);
}

export default Navigation;