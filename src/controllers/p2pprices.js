const { dbConnect } = require('../../config/postgres')

const getp2pPrices = async (req, res) => {
    try {
        const { fiat } = req.body
        const { crypto } = req.body

        const conexion = await dbConnect()
        const resultados = await conexion.query("select * \
                                                from public.p2p_prices where \
                                                (fiat = $1 or '%' = $1) and UPPER(crypto) = UPPER($2)\
                                                ", [fiat, crypto])
        res.json(resultados.rows)
    } catch (error) {
        return error
    }
}

module.exports = { getp2pPrices }