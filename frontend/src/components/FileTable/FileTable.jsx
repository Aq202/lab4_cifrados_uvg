import React, {use, useEffect} from "react";
import styles from "./FileTable.module.css";
import Button from "../Button";
import Spinner from "../Spinner";
import useFetch from "../../hooks/useFetch";
import useToken from "../../hooks/useToken";

function FileTable({ files, loading }) {

    const { callFetch: fetchFile, result: fileResult } = useFetch();
    const token = useToken();

    const handleDownload = async (fileId) => {
        fetchFile({
            uri: `/api/file/${fileId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': token,
            },
            parse: false,
        });
    }

    const handleResult = async () => {
    
        const blob = await fileResult.blob();

        // Obtener el nombre del archivo del header
        const contentDisposition = fileResult.headers.get('Content-Disposition');
        const match = contentDisposition?.match(/filename="?([^"]+)"?/);
        const fileName = match?.[1]?.trim() || 'archivo_descargado';

        // Crear URL y simular click
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();

    }

    useEffect(() => {
        if (!fileResult) return;
        handleResult();

    }, [fileResult]);

    return (
        <div className={styles.fileTableContainer}>
            <h2 className={styles.fileTableTitle}>Listado de Archivos</h2>
            {loading && <Spinner />}
            {files && (
                <table className={styles.fileTable}>
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Autor</th>
                        <th>ID del autor</th>
                        <th>Creado</th>
                        <th>Descargar</th>
                    </tr>
                    </thead>
                    <tbody>
                    {files.map((file) => (
                        <tr key={file.id}>
                        <td>{file.fileName}</td>
                        <td>{file.author}</td>
                        <td>{file.authorId}</td>
                        <td>{new Date(file.createdAt).toLocaleString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                            })}
                        </td>
                        <td>
                            <Button text="Descargar" className={styles.keyGenButton} onClick={() => handleDownload(file.id)} />
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            {files && files.length === 0 && (
                <div className={styles.noFiles}>
                No hay archivos disponibles.
                </div>
            )}
        </div>
    );
}

export default FileTable;