import React, { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import styles from './FileVerifySection.module.css';
import InputFile from '../../components/InputFile/InputFile';
import useToken from '../../hooks/useToken';
import useFetch from '../../hooks/useFetch';
import consts from '../../helpers/consts';
import LoadingView from '../../components/LoadingView/LoadingView';
import { FaCheckCircle as SuccessIcon } from "react-icons/fa";
import { IoMdCloseCircle as ErrorIcon } from "react-icons/io";
import InputText from '../InputText/InputText';

function FileVerifySection() {

    const [fileToUpload, setFileToUpload] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userIdError, setUserIdError] = useState(null);
    

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


    const handleFileUpload = () => {
        if (!fileToUpload) return;
        if (!token) return;
        if (!/^[0-9]+$/.test(userId)) return;

        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('fileName', fileToUpload.name);
        formData.append('userId', userId);

        fetchUploadFile({
            uri: `${consts.apiPath}/file/verify`,
            method: 'POST',
            removeContentType: true,
            body: formData,
            headers: {
                Authorization: token,
            },
        })

    }

    const handleUserIdBlur = (e) => {
        const id = e.target.value;
        if (!id) {
            setUserIdError('El id del usuario es obligatorio.');
            return;
        }

        if(!/^[0-9]+$/.test(id)) {
            setUserIdError('El id del usuario solo puede contener números.');
            return;
        }
        setUserIdError(null);
    }

    useEffect(() => {
        fileUploadReset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileToUpload]);

    return (

        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Verificar archivo:</h2>
            {uploadFileLoading && <LoadingView />}

            <div className={styles.inputFileContainer}>
                <InputFile onChange={handleFileToUploadChange} text='Archivo a verificar'/>
                <p className={styles.fileName}>{fileToUpload?.name}</p>
            </div>

            <InputText 
                title="Id del usuario"
                className={styles.inputText}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onBlur={handleUserIdBlur}
                onFocus={() => setUserIdError(null)}
                error={userIdError}
                />

            <Button text="Subir archivo"
                className={styles.uploadButton}
                blue
                onClick={handleFileUpload}
                disabled={!fileToUpload || !(/^[0-9]+$/.test(userId))} />


            {uploadFileError && <p className={styles.error}>{uploadFileError.message}</p>}
            {uploadFileResult && <p className={styles.success}>
                {uploadFileResult.match ?
                    <SuccessIcon className={styles.successIcon} />
                    : <ErrorIcon className={styles.errorIcon} />}
                {uploadFileResult.message}
            </p>}
        </section>
    );
}

export default FileVerifySection;
