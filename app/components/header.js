import React from "react";

const Header = () => {
    return (
        <header className="w-full flex justify-end p-12 fixed top-0 right-0 z-10">
            <button className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out">
                <a href="/admin">Admin Login</a>
            </button>
        </header>
    );
};

export default Header;
