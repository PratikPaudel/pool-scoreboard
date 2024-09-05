import React from 'react';

const Dashboard = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome to the Admin Dashboard
                    </h2>
                </div>
                <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">Recent Activities</h3>
                    <ul className="list-disc list-inside">
                        <li>User JohnDoe updated his profile</li>
                        <li>New score added by Pratik</li>
                        <li>Nick deleted a score</li>
                    </ul>
                </div>
                <div className="flex gap-4">
                    <button className="w-full text-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out">
                        Manage Users
                    </button>
                    <button className="w-full text-center bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out">
                        View Reports
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;