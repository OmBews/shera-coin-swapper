import { useEffect, useState } from "react";
import { GlobalProvider } from "./context/GlobalContext";
import FooterComponent from './components/Footer'
import Main from "./components/Main";
import StartScreen from "./components/StartScreen";
import Topbar from "./components/Topbar";


function App() {
  const [nextScreen, setNextScreen] = useState(false);
  const [error, setError] = useState(false);
  const [errMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!window.ethereum) {
      setError(true)
      setErrorMsg('Please install MetaMask');
    }

  }, []);
  return (
    <GlobalProvider>
      <Topbar />
      <div className="container mx-auto text-white min-h-screen flex items-center flex-col justify-around mt-14">
        {!nextScreen ? (<Main setNextScreen={setNextScreen} />) : (
          <StartScreen setError={setError} setErrorMsg={setErrorMsg} />
        )}
        {error && (
          <p className="text-red-600 text-xl text-center">{errMsg}</p>
        )}
      </div>
        <FooterComponent />
    </GlobalProvider>
  );
}

export default App;


