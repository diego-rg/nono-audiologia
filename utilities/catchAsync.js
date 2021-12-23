//Función para evitar usar try/catch varias veces no error handling das nosas rutas
module.exports = func => {
    return (req, res, next) => {
        func (req, res, next).catch(next);
    }
}