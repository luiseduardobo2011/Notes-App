import app from './app';

app.listen(process.env.SERVERPORT);
console.log(`Rodando na porta: ${process.env.SERVERPORT}`);
