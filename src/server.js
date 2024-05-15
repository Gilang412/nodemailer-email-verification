import express from 'express'
import cors from 'cors'
import env from 'dotenv'
import user_routes from './user/routes/user_routes'

env.config()

const app = express()
const PORT = process.env.PORT

app.use(
    cors({
      origin: "*"
    })
  );
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false }))

app.use(user_routes)


app.listen(PORT, ()=>{
    console.info("Server running on PORT: " + PORT)
})