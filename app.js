const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const cors = require('cors')
const bcrypt = require('bcrypt')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(showIp);
app.use(cors());

const corsOptions = {
    origin: 'http://www.midominio.es',
    methods: 'GET,HEAD,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
}

app.use(cors(corsOptions));

app.get('/usuarios', (req, res) =>{
    res.send("Lista de usuarios")
})

app.post('/registro', async (req, res) => {

    try {
        let contraseinaCifrada = bcrypt.hashSync(req.body.contrasenia, 10)
        let result = await app.locals.db.collection('usuarios')
            .insertOne({
                usuario: req.body.usuario,
                contrasenia: contraseinaCifrada
            })
        res.send({ mensaje: "Usuario registrado correctamente", result })
    } catch (error) {
        res.send({ mensaje: "Error al registrar al usuario", error })
    }
})

app.put('/editarUsuario/:id', (req, res) =>{

    let {nombre, email, contrasenia} = req.body;
    let {id} = req.params.id;

    res.send(`Se edito el usuario con id ${id}`)
})

app.delete('/borrarUsuario/:id', (req, res) =>{

    let {id} = req.params.id
    res.send("Usuario borrado")
})

app.post('/autentificar', async (req, res) => {
    
    try {
        let result = await app.locals.db.collection('usuarios')
            .find({ usuario: req.body.usuario })
        if (result.length > 0) {
            bcrypt.compareSync(req.body.contrasenia, result[0].contrasenia)
                ? res.send({ mensaje: 'Logueado correctamente' })
                : res.send({ mensaje: 'Contraseña incorrecta' })
        } else {
            res.send({ mensaje: 'El Usuario no existe' })
        }
    } catch (error) {
        res.send({ mensaje: "Error al registrar al usuario", error })
    }
})


function showIp(req, res, next) {
    let ip = req.ip;
    let url =  req.originalUrl

    console.log(ip, url );
    next();
}

app.listen(port || 3000, (e) =>{
    e
    ? console.log(`Error en servidor: ${e}`)
    : console.log("Servidor andando!");
});