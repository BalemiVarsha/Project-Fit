import React, { useEffect,useState } from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';
import { URL } from '../../data';
import './PmNavbar.css';
import io from 'socket.io-client';
const socket = io.connect(`${URL}`);

const PmNavbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${URL}/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` },
                body: JSON.stringify({ search: searchQuery })
            });
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json();
            setSearchResults(data);
            console.log("Search Results:", data);
            // window.location.href = '/all-projects';
            window.location.href = `/all-projects?searchQuery=${encodeURIComponent(searchQuery)}`;
        } catch (error) {
            console.error('Error performing search:', error);
        }
    };

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    useEffect(() => {
        socket.on("project-message", (num,data) => {
            console.log(num)
            setReceivedMessages((prevMessages) => [data, ...prevMessages]);
        });
        // Cleanup function to remove event listener when component unmounts
        return () => {
            socket.off("project-message");
        };
    }, []);

    const handleBellClick = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };
    const notificationCount = receivedMessages.length;

    return (
        <nav className="navbar">
            <div className="left">
                <form className="search-form" onSubmit={handleSearch} >
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-bar"
                        onChange={handleChange}
                    />
                    <button type="submit" className="search-button"><FaSearch /></button>
                </form>
            </div>
            <div className='box'>
                <div className="bell" onClick={handleBellClick}>
                    <span className="bell-icon"><FaBell /></span>
                    {notificationCount > 0 && <span className="notification-count">{notificationCount}</span>}
                    {isDropdownVisible && (
                        <div className="dropdown">
                            {receivedMessages.length === 0 ? (
                                <div className="no-notifications">No notifications</div>
                            ) : (
                                receivedMessages.map((message, index) => (
                                    <div key={index} className="message">
                                        <div className="message-title">{message.title}</div>
                                        <div className="message-content">{message.message}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default PmNavbar;




