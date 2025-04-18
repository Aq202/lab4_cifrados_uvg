import React, { use, useEffect, useContext } from 'react';
import styles from './HomePage.module.css';
import Button from '../../components/Button/Button';
import Spinner from '../../components/Spinner';
import FileUploadSection from '../../components/FileUploadSection/FileUploadSection';
import FileVerifySection from '../../components/FileVerifySection/FileVerifySection';
import FileTable from '../../components/FileTable/FileTable';
import PopUp from '../../components/PopUp/PopUp';
import SessionContext from '../../context/SessionContext';
import usePopUp from '../../hooks/usePopUp';
import useFetch from '../../hooks/useFetch';
import useToken from '../../hooks/useToken';
import { useNavigate } from "react-router-dom";

function HomePage() {

  const [isKeyGenOpen, openKeyGen, closeKeyGen] = usePopUp(false);
  const { refreshToken } = useContext(SessionContext);
  const navigate = useNavigate();

  const {
    callFetch: fetchKeyGen,
    result: resultKeyGen,
    loading: loadingKeyGen,
    error: errorKeyGen,
    reset: resetKeyGen,
  } = useFetch();

  const { callFetch: fetchFiles, result: filesResult, loading: loadingFiles } = useFetch();

  const token = useToken();

  const handleKeyGen = async (algorithm) => {
    
    fetchKeyGen({
      uri: '/api/key/generate',
      method: 'POST',
      body: JSON.stringify({ algorithm }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

  }

  const logout = () => {
    localStorage.removeItem('token');
    refreshToken();
    
    // Refrescar la página para que se elimine el token de la sesión
    window.location.reload();
  }

  useEffect(() => {
    if (!resultKeyGen) return;

    // Colocar la llave privada generada en un archivo y descargarla
    const { privateKey } = resultKeyGen;
    const blob = new Blob([privateKey], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'privateKey.pem';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  }, [resultKeyGen]);

  useEffect(() => {

    fetchFiles({
      uri: '/api/file',
      method: 'GET',
    });

  }, []);
 
  return (
    <div className={styles.pageContainer}>
        <header className={styles.header}>
            <h1 className={styles.title}>Bienvenido a AsyStorage</h1>
            <div className={styles.keyGenButtonContainer}>
              <Button text="Generar llaves" green onClick={openKeyGen} />
              <Button text="Cerrar sesión" onClick={logout} />
            </div>
        </header>

        <main>
            <FileUploadSection />
            <br />
            <br />
            <FileVerifySection />
        </main>

        <FileTable files={filesResult?.files} loading={loadingFiles}/>

      {isKeyGenOpen && (
        <PopUp close={closeKeyGen} closeButton closeWithBackground maxWidth={600} callback={resetKeyGen}>
          <div className={styles.keyGenContainer}>
            <h2 className={styles.keyGenTitle}>Generar llaves</h2>
            <p className={styles.keyGenDescription}>Genera una nueva llave pública y privada para cifrar y descifrar archivos.</p>
            <p className={styles.keyGenWarning}>Advertencia: Al generar un nuevo par de llaves, los archivos que hayas subido hasta este momento quedarán inservibles.</p>
          </div>
          {!loadingKeyGen && !resultKeyGen && (
            <div className={styles.keyGenButtonContainer}>
              <Button text="Generar llaves RSA" className={styles.keyGenButton} green onClick={() => handleKeyGen('RSA')} />
              <Button text="Generar llaves ECC" className={styles.keyGenButton} onClick={() => handleKeyGen('ECC')} />
            </div>
          )}
          {loadingKeyGen && <Spinner />}
          {errorKeyGen && <p className={styles.errorMessage}>{errorKeyGen.message}</p>}
          {resultKeyGen && (
            <div className={styles.keyGenResultContainer}>
              <h3 className={styles.keyGenResultTitle}>Llave generada</h3>
              <p className={styles.keyGenResultDescription}>En tus descargas encontrarás tu nueva llave privada. ¡No la pierdas!</p>
            </div>
          )}
        </PopUp>
      )}

    </div>
  );
}

export default HomePage;
