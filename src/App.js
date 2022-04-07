import { useEffect, useState } from "react";
import { GlobalProvider } from "./context/GlobalContext";
import FooterComponent from './components/Footer'
import Main from "./components/Main";
import StartScreen from "./components/StartScreen";


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
      {!nextScreen ? (<Main setNextScreen={setNextScreen} />) : (
        <StartScreen />
      )}
      {error && (
        <p className="text-red-600 text-xl text-center">{errMsg}</p>
      )}
      <FooterComponent />
    </GlobalProvider>
  );
}

export default App;


