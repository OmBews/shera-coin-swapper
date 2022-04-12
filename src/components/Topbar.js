import metamaskIcon from './../assets/metamask.svg'

// Testnet Addresses
// const SheraV2Address = "0xE38d69cd47ffE1966599CBC6BfE46c04EC4256F3";


// mainnet Addresses
const SheraV2Address = "0x9DAd3A600e7fD63Fbaf2DbAA429F2200d03Aa648";

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