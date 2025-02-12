import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

const app = express();
app.use(cors({
  origin: ['https://soft-kitsune-d9cbbb.netlify.app'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Configurar Mercado Pago
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
});

// Crear preferencia de pago
app.post('/create-preference', async (req, res) => {
    try {
        const preference = new Preference(client);
        const preferenceData = {
            items: req.body.items,
            back_urls: {
                success: `${process.env.VITE_FRONTEND_URL}/success`,
                failure: `${process.env.VITE_FRONTEND_URL}/failure`,
                pending: `${process.env.VITE_FRONTEND_URL}/pending`
            },
            auto_return: 'approved',
            notification_url: `${process.env.VITE_API_URL}/webhook`,
        };

        const response = await preference.create({ body: preferenceData });
        res.json({
            id: response.id,
            init_point: response.init_point
        });
    } catch (error) {
        console.error('Error al crear la preferencia:', error);
        res.status(500).json({ 
            error: true,
            message: 'Error al crear la preferencia de pago'
        });
    }
});

// Webhook para notificaciones de pago
app.post('/webhook', async (req, res) => {
    try {
        const payment = req.query;
        
        if (payment.type === 'payment') {
            const data = await client.payment.findById(payment['data.id']);
            console.log('Pago recibido:', data);
            // Aquí puedes implementar la lógica cuando el pago es exitoso
            // Por ejemplo, actualizar el estado en tu base de datos
        }
        
        res.status(200).send('OK');
    } catch (error) {
        console.error('Error en webhook:', error);
        res.status(500).send('Error al procesar el webhook');
    }
});

// Ruta de éxito
app.get('/success', async (req, res) => {
    res.redirect(`${process.env.VITE_FRONTEND_URL}?status=approved`);
});

// Ruta de fallo
app.get('/failure', async (req, res) => {
    res.redirect(`${process.env.VITE_FRONTEND_URL}?status=rejected`);
});

// Ruta de pago pendiente
app.get('/pending', async (req, res) => {
    res.redirect(`${process.env.VITE_FRONTEND_URL}?status=pending`);
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor de MercadoPago funcionando correctamente');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
