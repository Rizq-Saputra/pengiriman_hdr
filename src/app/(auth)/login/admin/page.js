"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VeryTopBackButton } from "@/components/ui/very-top-back-button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await fetch(`${BASE_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                if (!res.ok) {
                    const { error } = (await res.json());
                    throw new Error(error);
                }
                
            

            const { token, refreshToken } = await res.json();
            localStorage.setItem("token", token); // Save JWT in localStorage
            localStorage.setItem("refreshToken", refreshToken); // Save refresh token in localStorage
            router.push("/dashboard"); // Redirect to a protected page
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid place-items-center min-h-screen p-8">
            <VeryTopBackButton />
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Masukan username dan password untuk masuk.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Your username"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required   onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                </CardContent>
                <CardFooter className="flex gap-4 flex-col">
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                  {/* add loading indicator when submit */}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Loading..." : "Login"}
                    </Button>
                </CardFooter>
                </form>
            </Card>
        </div>
    );
}
