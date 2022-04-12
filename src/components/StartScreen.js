import logo from './../assets/shera-logo.svg';
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import Web3Modal from 'web3modal';
import { GlobalContext } from "../context/GlobalContext";
import v1Abi from './../abi/sheraV1.json';
import v2Abi from './../abi/sheraV2.json';
import swapperAbi from './../abi/sheraSwapper.json';

const SheraV1Address = "0x029E391FC9fbE3183ecCaDBDd029149B49B1dbC5";
const SheraV2Address = "0x9DAd3A600e7fD63Fbaf2DbAA429F2200d03Aa648";
const SwapperAddress = "0xf73B08cc165d37d0f97afF4A40A8009D0d8Fd23b";




const StartScreen = ({ setError, setErrorMsg }) => {

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
            } catch (e) {
                setError(true)
                setErrorMsg('Contract not deployed to current network, please change network in MetaMask')
            }
        }
    }

    const disconnectWallet = () => {
        delAccount();
    }

    const doApprove = async (signer) => {

        const contract = blockchainData.V1Contract.connect(signer);
        const tx = await contract.approve(SwapperAddress, blockchainData.wei_balance, { gasLimit: String(285000) })
        await tx.wait()
        console.log(tx)
        const txReceipt = web3.getTransactionReceipt(tx.hash);
        console.log(txReceipt)
        return txReceipt
    }

    const swap = async () => {
        try {
            setLoading(true);
            const signer = web3.getSigner();
            const approve = await doApprove(signer)
            if (approve.blockNumber) {
                const swapContract = blockchainData.swap_contract.connect(signer);
                const tx = await swapContract.doSwap({ gasLimit: String(450000) });
                await tx.wait()
                console.log(tx)
                setLoading(false);
            }
            setLoading(false);
            loadBlockChain()
        } catch (e) {
            setLoading(false);
        }

    }

    const addToken = async () => {
        const tokenAddress = SheraV2Address;
        const tokenSymbol = 'SHR';
        const tokenDecimals = 9;
        const tokenImage = '';

        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: tokenAddress, // The address that the token is at.
                        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: tokenDecimals, // The number of decimals in the token
                        image: tokenImage, // A string url of the token logo
                    },
                },
            });

            if (wasAdded) {
                console.log('Thanks for your interest!');
            } else {
                console.log('Your loss!');
            }
        } catch (error) {
            console.log(error);
        }
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
                    <img className='w-4/5 mx-auto' src={logo} alt="Shera tokens" />
                </div>
                {
                    blockchainData && (
                        <div>
                            <div className='mb-3 px-4 py-4 bg-gray-900 mx-2'>
                                <p className='text-center text-xl'>Shera Old Token Balance: {blockchainData.tbalance} SHR</p>
                                <div className='flex justify-between items-center flex-col'>
                                    <button disabled={(parseInt(blockchainData.tbalance) === 0 || loading === true)} className="btn-grad mt-4 px-8 py-1" onClick={() => swap()}>Swap</button>
                                    <button className="btn-grad mt-4 px-8 py-1" onClick={() => addToken()}>Add New Shera Token To Your Metamask</button>
                                </div>
                            </div>
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