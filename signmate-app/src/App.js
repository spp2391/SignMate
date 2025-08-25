import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Join from './User/pages/Join';
import Login from './User/pages/Login';
import Edit from './User/pages/Edit';

function App() {
    return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/login" element={<Login />} />
				<Route path="/join" element={<Join />} />
				<Route path="/mypage/edit" element={<Edit/>} />
			</Routes>
		</BrowserRouter>
    );
}

export default App;
