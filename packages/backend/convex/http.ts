import { httpRouter } from "convex/server";

import { authComponent, createAuth } from "./auth";
import { handshake } from "./handshake";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);
http.route({
	path: "/api/molt/handshake",
	method: "POST",
	handler: handshake,
});

export default http;
