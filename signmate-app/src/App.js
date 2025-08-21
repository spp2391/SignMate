import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Join from './User/pages/Join';
import Login from './User/pages/Login';

function App() {
    return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/login" element={<Login />} />
				<Route path="/join" element={<Join />} />
			</Routes>
		</BrowserRouter>
    );
}

export default App;
