import type { RequestHandler } from "express";

/**
 * Checks if an incoming request's hostname is the loopback IP 127.0.0.1
 * If so, it redirects the request to the same path but using localhost as the hostname.
 * This is primarily used in local development to address situations where external services (e.g., OAuth provider callbacks)
 * send the browser back to http://127.0.0.1:port/..., forcing the final request to be made to http://localhost:port/...
 * for correct cookie handling.
 */
export default function redirectToLocalhost(): RequestHandler {
    return (req, res, next) => {
        if (req.hostname === "127.0.0.1") {
            const url = new URL(`${req.protocol}://${req.host}${req.url}`);
            url.hostname = "localhost";
            req.logger.info(`Detected 127.0.0.1 hostname, redirecting to localhost: ${url}`);
            res.redirect(url.toString());
        } else {
            next();
        }
    };
}
