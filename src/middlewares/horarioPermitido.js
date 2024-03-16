//Função middlware que permite o acesso da API apenas de 08:00 às 17:00.

const confereHorario = (req, res, next) => {
    let date = new Date()
    let hora = date.getHours()
    if (hora < 8 || hora > 17) {
        return res.json({mensagem: `Não é permitido fazer esta requisição neste horário. Tente novamente entre 08:00 às 17:00 horas.`})
    }
    next()
}

module.exports = confereHorario
