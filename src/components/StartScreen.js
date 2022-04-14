import logo from './../assets/shera-logo.svg';
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import Web3Modal from 'web3modal';
import { GlobalContext } from "../context/GlobalContext";
import v1Abi from './../abi/sheraV1.json';
import v2Abi from './../abi/sheraV2.json';
import swapperAbi from './../abi/sheraSwapper.json';


// Testnet Addresses
// const SheraV1Address = "0x74330107edCD78ec265138587E9df38243450161";
// const SheraV2Address = "0xBc5115A3A5EA6503FABbb4af8BeD52527bD52717";
// const SwapperAddress = "0xF92e89f4182C7f95f0D33530c7E0E7b7c9d6FB2b";


// mainnet Addresses
const SheraV1Address = "0x029E391FC9fbE3183ecCaDBDd029149B49B1dbC5";
const SheraV2Address = "0xCd275450b516Eed6ddFfCdF76168e66f9a8ADb44";
const SwapperAddress = "0x9F0895831880fBFd42b163F0722c35420CdebdaA";


// const SwapperAddress = "0xf73B08cc165d37d0f97afF4A40A8009D0d8Fd23b";




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
    const stopSwapping = true;

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
        const tx = await contract.approve(SwapperAddress, blockchainData.wei_balance)
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
                const tx = await swapContract.doSwap();
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
                                {!stopSwapping ? (
                                    <button disabled={(parseInt(blockchainData.tbalance) === 0 || loading === true)} className="btn-grad mt-4 px-8 py-1" onClick={() => swap()}>Swap</button>
                                ) : (
                                    <p className='mt-5 text-red-700'>Swap time is over</p>
                                )}
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

    )
}

export default StartScreen