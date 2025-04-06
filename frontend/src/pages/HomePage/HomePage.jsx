import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import styles from './HomePage.module.css';
import InputFile from '../../components/InputFile/InputFile';

function HomePage() {

    const [fileToUpload, setFileToUpload] = useState(null);

    const handleFileUploadChange = (file) => {
        setFileToUpload(file[0]);
    }
 
  return (
    <div className={styles.pageContainer}>
        <header className={styles.header}>
            <h1 className={styles.title}>Bienvenido Usuario</h1>
            <Button text="Generar llaves" className={styles.keyButton} green />
        </header>

        <main>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Subir archivo:</h2>
                
                <InputFile onChange={handleFileUploadChange}/>
                
                {fileToUpload && <div className={styles.fileInfo}>
                    <p className={styles.fileName}>{fileToUpload?.name}</p>
                    <Button text="Subir archivo" className={styles.uploadButton} blue />
                </div>}
            </section>

        </main>
    </div>
  );
}

export default HomePage;
