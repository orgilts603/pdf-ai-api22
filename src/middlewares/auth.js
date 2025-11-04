import supabase from "../lib/supabase";
import { createClient } from "@supabase/supabase-js";

export async function supabaseAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Validate token and get user
    const { data: user, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user; // inject user info into request



    // Token-ийг тухайн хэрэглэгчийн session-д зориулж client-д оруулна
    req.supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {
            global: {
                headers: { Authorization: `Bearer ${token}` },
            },
        }
    );
    next();
}
