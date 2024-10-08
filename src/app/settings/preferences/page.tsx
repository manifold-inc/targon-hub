"use client";

import { Sidebar } from "@/app/_components/settings/sidebar";
import { useState } from "react";
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

export default function Page() {
  const [sendEmails, setSendEmails] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="p-8">
          <button
            onClick={toggleSidebar}
            className="mb-4 text-gray-400 hover:text-white focus:outline-none"
          >
            {isSidebarOpen ? (
              <ChevronLeftIcon className="h-6 w-6" />
            ) : (
              <div className="w-6 h-0.5 bg-gray-400 hover:bg-white" />
            )}
          </button>
          <h1 className="text-3xl font-bold mb-8">Settings</h1>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
            <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
              <span>Send me emails</span>
              <button
                onClick={() => setSendEmails(!sendEmails)}
                className={`w-14 h-7 flex items-center rounded-full p-1 ${
                  sendEmails ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${
                  sendEmails ? "translate-x-7" : ""
                }`} />
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Alert notifications will be sent to alex@manifold.inc
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Account</h2>
            <p className="text-sm text-gray-400 mb-4">
              Manage your login credentials, security settings, or delete your account.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200">
              Manage Account
            </button>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Ignored Providers</h2>
            <p className="text-sm text-gray-400 mb-4">
              Select the providers you want to exclude from serving your requests.
            </p>
            <select className="bg-gray-800 text-white p-3 rounded-lg w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option>Select a provider</option>
            </select>
            <p className="text-sm text-gray-400 mt-2">
              No providers are ignored.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Default Model</h2>
            <p className="text-sm text-gray-400 mb-4">
              Apps will use this model by default, but they may override it if they choose to do so. This model will also be used as your default fallback model.
            </p>
            <a href="#" className="text-blue-400 hover:underline">Click here</a> to browse available models and prices.
            <select className="bg-gray-800 text-white p-3 rounded-lg w-full mt-4 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option>Select a model</option>
            </select>
          </section>
        </div>
      </div>
    </div>
  );
}
