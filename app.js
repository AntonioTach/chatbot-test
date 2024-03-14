const axios = require('axios').default;

const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')

const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

// import { saludos } from './keywords/saludos'

const flowBienvenida = addKeyword(EVENTS.WELCOME).addAnswer('Buenas, bienvenido a mi tienda online!');

const flowMultimedia = addKeyword('hola').addAnswer('Te envio una imagen', {
    media: 'https://image.api.playstation.com/vulcan/ap/rnd/202009/3021/B2aUYFC0qUAkNnjbTHRyhrg3.png',
}).addAnswer('Te envio un video')
.addAnswer('Te envio un audio')

const flowSaludos = addKeyword('saludos').addAnswer('Hola, como estas?',null, () => {
    console.log('Se ejecuto el callback')
}, [flowMultimedia]);

const flujoProductos = addKeyword('productos')
.addAnswer('Estos son los productos que tenemos disponibles', null, async (ctx, {flowDynamic}) => {
    let count = 0
    const response = await axios('https://fakestoreapi.com/products')
    
    for (const item of response.data) {
        if (count > 4) break;
        count++
        flowDynamic({body: item.title, media: item.image})
    }

})

const flujoPrincipal = addKeyword('xd')
.addAnswer('Bienvenido a mi ecommerce', null, null, [flujoProductos])

flows = [
    flowBienvenida,
    flowSaludos,
    flujoPrincipal
]

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow(flows)
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB
    })

    QRPortalWeb();
}

main()
