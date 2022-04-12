import metamaskIcon from './../assets/metamask.svg'

// Testnet Addresses
const SheraV2Address = "0xBc5115A3A5EA6503FABbb4af8BeD52527bD52717";


// mainnet Addresses
// const SheraV2Address = "0xCd275450b516Eed6ddFfCdF76168e66f9a8ADb44";

function Topbar() {

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
    return (
        <div className="w-full min-h-[50px] px-5 pt-5 sticky top-0 ">
            <button className='text-white text-xs flex flex-row items-center justify-between px-4 py-1 rounded-lg border hover:bg-white hover:bg-opacity-25 ease-in duration-200 hover:shadow-md hover:shadow-white ' onClick={() => addToken()}>
                <img className="w-5 mr-2" src={metamaskIcon} alt="metamask"  />
                Add Shera new token
            </button>
        </div>
    )
}

export default Topbar