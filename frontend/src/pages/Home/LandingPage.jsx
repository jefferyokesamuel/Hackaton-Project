import React from "react";
import { Link } from "react-router-dom";
import fileverse from "../../assets/Fileverse.jpg"

const LandingPage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">OnChain <span className="text-green-600">Diary</span></h1>
        <Link
          to="/signup"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign Up / Login
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-5xl font-bold mb-6">Welcome to OnChainDiary</h2>
          <p className="text-xl mb-8">
            Create and store your diary entries securely on the blockchain. 
            Your memories, forever preserved and accessible only to you.
          </p>
          <Link
            to="/signup"
            className="bg-green-600 hover:bg-green-900 text-white font-bold py-3 px-6 rounded-lg text-lg"
          >
            Get Started
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-lg">
        Powered by{" "}
        <a
          href="https://fileverse.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Fileverse
        </a>
        <img src={fileverse} className="w-32 ml-[630px]" />
      </footer>
    </div>
  );
};

export default LandingPage;
