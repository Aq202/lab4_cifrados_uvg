const saveFileController = (req, res) => {

    let error = null;
    if(!(req.uploadedFiles?.length > 0)) {
       error = 'No se subió ningún archivo.';
    }else if (!req.body.privateKey){
        error = "El campo 'privateKey' es obligatorio.";
    }
    
    if (error) {
        res.status(400).send({ err: error, status: 400 });
        return;
    }

    const privateKey = req.body.privateKey;
    console.log('privateKey', privateKey);

    res.status(200).send({
        message: 'Archivo subido correctamente.',
    });


};

export {
    saveFileController,
};