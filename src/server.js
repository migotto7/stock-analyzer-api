import app from "../src/app.js"

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
})