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
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useSwal } from "@/hooks/use-swal"; // Import useSwal

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Kolom nama harus diisi.",
  }),
  password: z.string().min(1, {
    message: "Sandi tidak boleh kosong.",
  }),
});

export default function Login() {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showAlert } = useSwal(); // Initialize useSwal

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi data form menggunakan Zod
    const result = formSchema.safeParse({ username, password });

    if (!result.success) {
      // Tangani error validasi
      const errors = result.error.flatten().fieldErrors;
      setFormErrors(errors);
      return;
    }

    // Reset error
    setFormErrors({});
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }

      const { token, refreshToken } = await res.json();
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
      // Show error using SweetAlert
      showAlert({
        icon: "error",
        title: "Gagal Masuk",
        text: err.message,
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
          <CardTitle className="text-2xl mx-auto">Masuk</CardTitle>
          <CardDescription>
            Masukan nama dan sandi untuk masuk ke halaman.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} autoComplete="off">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nama</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan Nama"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {formErrors.username && (
                <p className="text-red-500 text-sm">{formErrors.username[0]}</p>
              )}
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password">Sandi</Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Masukkkan Sandi"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff size={20} aria-label="Hide password" />
                  ) : (
                    <Eye size={20} aria-label="Show password" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-red-500 text-sm">{formErrors.password[0]}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex gap-4 flex-col">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" variant="default" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Masuk"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
