import { post, ServerRequest, ServerResponse } from "microrouter";
import { send, json } from "micro";

import { getProfile } from "../database";
import { verifyToken, validPassword, generateToken } from "../utils";

export default [
    post("/auth/checkToken", async (req: ServerRequest, res: ServerResponse) => {
        try {
            const body = await json(req) as { token: string, username: string };
            await verifyToken(body.token);
            send(res, 200, { token: body.token });
        } catch(e) {
            console.log(e);
            send(res, e.httpStatus || 500, e.message || null);
        }
    }),
    post("/auth/signin", async (req: ServerRequest, res: ServerResponse) => {
        try {
            const body = await json(req) as { username: string, password: string };
            const profile = await getProfile({ username: body.username });
            await validPassword(body.password, profile.password);
            const token = await generateToken(body.username, body.password);
            send(res, 200, { token });
        } catch(e) {
            console.log(e);
            send(res, e.httpStatus || 500, e.message || null);
        }
    })
];
