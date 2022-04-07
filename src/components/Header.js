import { ethers } from "ethers";
import { useContext, useEffect } from "react";
import Web3Modal from 'web3modal';
import { GlobalContext } from "../context/GlobalContext";


const HeaderComponent = () => {

    const { account, addAccount } = useContext(GlobalContext);

    const connectWallet = async () => {
        console.log("adsasd")
        if (!window.ethereum) {
            alert('Please install MetaMask');
            return
        }
        const web3modal = new Web3Modal();
        const instance = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        addAccount({ id: address });
        
    }
    useEffect(()=>{
        if(window.ethereum) {
            window.ethereum.on('accountsChanged', accounts => {
                addAccount({ id: accounts[0] })
            })
            window.ethereum.on('chainChanged', chainId => {
                window.location.reload();
            })
        }
    }, [account]);
    return (
        <div className="w-full flex items-center justify-between p-7 flex-col sm:flex-row">
            <div className="">
                <h1 className="text-3xl font-bold font-mono">AAB TOKEN</h1>
            </div>
            <div className="mt-4 sm:mt-0">
                {account ? (
                    <div className="flex items-center flex-col">
                        <a
                            href={`https://etherscan.io/address/${account}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-300 rounded-full">
                            {account.slice(0, 5) + '...' + account.slice(38, 42)}
                        </a>
                    </div>
                ) : (
                    <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-300 rounded-full" onClick={() => connectWallet()}>Connect Wallet</button>
                )}
            </div>

        </div>
    );
};

export default HeaderComponent;
