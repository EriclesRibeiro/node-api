import { Router } from 'express';

const routes = Router();

routes.get("/", (req, res) => res.send("CRONOS SOFTWARE! 0.0.1"))

export default routes;