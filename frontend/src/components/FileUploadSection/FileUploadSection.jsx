import React, { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import styles from './FileUploadSection.module.css';
import InputFile from '../../components/InputFile/InputFile';
import useToken from '../../hooks/useToken';
import useFetch from '../../hooks/useFetch';
import consts from '../../helpers/consts';
import LoadingView from '../../components/LoadingView/LoadingView';
import { FaCheckCircle as SuccessIcon } from "react-icons/fa";

function FileUploadSection() {

    const [fileToUpload, setFileToUpload] = useState(null);
    const [privateKey, setPrivateKey] = useState(null);

    const token = useToken();

    const {
        callFetch: fetchUploadFile,
        result: uploadFileResult,
        loading: uploadFileLoading,
        error: uploadFileError,
        reset: fileUploadReset,
    } = useFetch();

    const handleFileToUploadChange = (file) => {
        setFileToUpload(file[0]);
    }

    const handlekeyFileChange = (file) => {
        const keyFile = file?.[0];
        if (keyFile) {
            const reader = new FileReader();
        
            // Evento que se ejecuta cuando se ha leído el archivo
            reader.onload = function(e) {
              const fileText = e.target.result;
              setPrivateKey([keyFile.name, fileText]);
            };
        
            reader.readAsText(keyFile);
        }
    }

    const handleFileUpload = () => {
        if (!fileToUpload) return;
        if (!privateKey) return;
        if (!token) return;

        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('fileName', fileToUpload.name);
        formData.append('privateKey', privateKey[1]);

        fetchUploadFile({
            uri: `${consts.apiPath}/file/save`,
            method: 'POST',
            removeContentType: true,
            body: formData,
            headers: {
                Authorization: token,
            },
        })

    }

    useEffect(() => {
        fileUploadReset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileToUpload]);

    return (

        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Subir archivo:</h2>
            {uploadFileLoading && <LoadingView />}

            <div className={styles.inputFileContainer}>
                <InputFile onChange={handleFileToUploadChange} />
                <p className={styles.fileName}>{fileToUpload?.name}</p>
            </div>
            <div className={styles.inputFileContainer}>
                <InputFile onChange={handlekeyFileChange} text='Seleccionar llave privada'/>
                <p className={styles.fileName}>{privateKey?.[0]}</p>
            </div>

            <Button text="Subir archivo"
                className={styles.uploadButton}
                blue
                onClick={handleFileUpload}
                disabled={!fileToUpload || !privateKey} />


            {uploadFileError && <p className={styles.error}>{uploadFileError.message}</p>}
            {uploadFileResult && <p className={styles.success}>
                <SuccessIcon className={styles.successIcon} />
                Archivo subido correctamente
            </p>}
        </section>
    );
}

export default FileUploadSection;
