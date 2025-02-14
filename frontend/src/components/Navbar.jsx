import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import SearchBar from "./SearchBar/SearchBar";
import ProfileInfo from "./Cards/ProfileInfo";

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("No crypto wallet found. Please install MetaMask or another provider.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      });
    }
  }, []);

  // Function to truncate wallet address (e.g., "0xAbC...1234")
  const truncateAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  };

  return (
    <>
      {/* Overlay: Blocks access until a wallet is connected */}
      {!walletAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">Connect Your Wallet</h2>
            <button
              onClick={connectWallet}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="bg-[#1A1A1A] flex items-center justify-between px-6 py-2 drop-shadow">
        <Link to={"/"}>
          <h2 className="text-xl font-medium text-black py-2">
            <span className="text-slate-500">OnChain</span>
            <span className="text-green-600">Diary</span>
          </h2>
        </Link>

        <SearchBar
          value={searchQuery}
          onChange={({ target }) => setSearchQuery(target.value)}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />

        {walletAddress ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700 bg-gray-200 px-3 py-1 rounded-lg">
              {truncateAddress(walletAddress)}
            </span>
            <ProfileInfo userInfo={{ ...userInfo, address: walletAddress }} />
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </>
  );
};

export default Navbar;
