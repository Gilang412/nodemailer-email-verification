import { Router } from "express";
import register_user from "../controller/register_user";
import verify_user from "../controller/verify_user";

const user_routes = new Router()

user_routes.post('/api/user/create', register_user)
user_routes.get("/api/user/verify", ((req, res) => verify_user(req, res)))

export default user_routes
