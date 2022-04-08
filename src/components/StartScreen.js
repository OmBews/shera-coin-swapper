import logo from './../assets/logo.png';
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import Web3Modal from 'web3modal';
import { GlobalContext } from "../context/GlobalContext";
import v1Abi from './../abi/sheraV1.json';
import v2Abi from './../abi/sheraV2.json';
import swapperAbi from './../abi/sheraSwapper.json';

const SheraV1Address= "0x92394b8b2f06444D1eAA4F791AA5312baC8E0Cb6";
const SheraV2Address = "0xC6914a6d0D406399E1Ad55568F54DB27875a71fF";
const SwapperAddress = "0x39F8F3A8550a65D5D8E7C97Acc228BCC6a8ce7fB";




const StartScreen = ({setError, setErrorMsg}) => {

    const { account,
        blockchainData,
        network,
        delAccount,
        addAccount,
        addNetwork,
        addBlockchain } = useContext(GlobalContext);

    const [web3, setWeb3] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadBlockChain = async () => {
        if (web3 && account) {
            try {
                const SheraV1Contract = new ethers.Contract(SheraV1Address, v1Abi, web3);
                const SheraSwapContract = new ethers.Contract(SwapperAddress, swapperAbi, web3);
                const tokenBalanceWei = await (await SheraV1Contract.balanceOf(account)).toString();
                const tokenBalance = ethers.utils.formatUnits(tokenBalanceWei, '9');
                addBlockchain({
                    'V1Contract': SheraV1Contract, 
                    'wei_balance': tokenBalanceWei, 
                    'tbalance': tokenBalance,
                    'swap_contract': SheraSwapContract
                })
            } catch(e) {
                setError(true)
                setErrorMsg('Contract not deployed to current network, please change network in MetaMask')
            }
        }
    }

    const disconnectWallet = () => {
        delAccount();
    }

    const doApprove = async(signer) => {
        
        const contract = blockchainData.V1Contract.connect(signer);
        const tx = await contract.approve(SwapperAddress, blockchainData.wei_balance, {gasLimit: String(285000)})
        await tx.wait()
        console.log(tx)
        const txReceipt = web3.getTransactionReceipt(tx.hash);
        console.log(txReceipt)
        return txReceipt
    }

    const swap = async () => {
        setLoading(true);
        const signer = web3.getSigner();
        const approve = await doApprove(signer)
        if (approve.blockNumber) {
            const swapContract = blockchainData.swap_contract.connect(signer);
            const tx = await swapContract.doSwap({gasLimit: String(285000)});
            await tx.wait()
            console.log(tx)
            setLoading(false);
        }
        setLoading(false);
        loadBlockChain()

    }

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask');
            return
        }
        const web3modal = new Web3Modal();
        const instance = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        setWeb3(provider);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        addAccount({ id: address });
        const networkId = await provider.getNetwork();
        addNetwork(networkId)

    }
    useEffect(() => {
        loadBlockChain();
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', accounts => {
                addAccount({ id: accounts[0] })
            })
            window.ethereum.on('chainChanged', chainId => {
                window.location.reload();
            })
        }
        console.log(blockchainData)
    }, [account, blockchainData?.wei_balance]);
    return (
        <div className="container mx-auto text-white min-h-screen flex items-center">
            <div className="flex items-center flex-col w-full">
                <div className="max-w-xs mx-auto p-2">
                    <img src={logo} alt="Shera tokens" />
                </div>
                {
                    blockchainData && (
                        <div className='mb-3 px-4 py-4 bg-gray-900 mx-2'>
                            <p className='text-center text-xl'>Shera Old Token Balance: {blockchainData.tbalance} SHR</p>
                            <button disabled={(parseInt(blockchainData.tbalance) === 0 || loading === true)} className="btn-grad mt-4 mx-auto px-8 py-1" onClick={() => swap()}>Swap</button>
                        </div>
                    )
                }
                <div className="p-4">
                    <div className="max-w-xs mx-auto">
                        {account ? (
                            <button className="btn-grad px-4 py-3" onClick={() => disconnectWallet()}>Disconnect</button>
                        ) : (
                            <button className="btn-grad px-4 py-3" onClick={() => connectWallet()}>Connect Wallet</button>
                        )}
                    </div>
                </div>

            </div>

        </div>
    )
}

export default StartScreen