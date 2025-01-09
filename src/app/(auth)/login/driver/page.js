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
import { useToast } from "@/hooks/use-toast";

export default function LoginDriver() {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const [nope, setNope] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await fetch(`${BASE_URL}/api/supir/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "no_telepon": nope,
                    "password": password,
                }),
            });


            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Failed to login");
            }

            const { token, refreshToken } = await res.json();
            localStorage.setItem("token", token);
            localStorage.setItem("refreshToken", refreshToken);
            toast({
                title: "Success",
                description: "Logged in successfully",
                variant: "success",
            });
            router.push("/driver");
        } catch (err) {
            setError(err.message);
            toast({
                title: "Error",
                description: err.message || "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid place-items-center min-h-screen p-8">
            <VeryTopBackButton />
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Driver</CardTitle>
                    <CardDescription>
                        Masukan username dan password untuk masuk.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nope">No. HP</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="cth: 0822123xxx"
                                onChange={(e) => setNope(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
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
