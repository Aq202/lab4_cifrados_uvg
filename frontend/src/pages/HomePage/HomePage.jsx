import React from 'react';
import Button from '../../components/Button/Button';
import styles from './HomePage.module.css';
import FileUploadSection from '../../components/FileUploadSection/FileUploadSection';

function HomePage() {
 
  return (
    <div className={styles.pageContainer}>
        <header className={styles.header}>
            <h1 className={styles.title}>Bienvenido Usuario</h1>
            <Button text="Generar llaves" className={styles.keyButton} green />
        </header>

        <main>
            <FileUploadSection />   
        </main>
    </div>
  );
}

export default HomePage;
