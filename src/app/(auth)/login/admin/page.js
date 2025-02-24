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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Eye, EyeOff,ArrowLeft } from "lucide-react";
import { useSwal, showPostRedirectAlert } from "@/hooks/use-swal"; // Import useSwal
import Image from "next/image"; // Import Image dari Next.js

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
  const { showPostRedirectAlert, showAlert } = useSwal();


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
      // Tampilkan notifikasi sukses
      showPostRedirectAlert({
        title: "Sukses",
        text: "Berhasil Masuk",
        icon: "success",
      });
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
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        background: "linear-gradient(135deg, #2C3192, #EC1F25)",
      }}
    >
      <Card className="w-full max-w-md bg-[#F3F2F7] shadow-lg">
      <CardHeader className="flex flex-col items-center relative w-full">
          <button
            className="absolute left-0 top-0 p-2 text-[#2C3192]"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={24} />
          </button>
          {/* Logo */}
          <div className="mb-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
          <CardTitle className="text-2xl text-[#2C3192]">Admin</CardTitle>
          <CardDescription className="text-center text-[#2C3192]">
            Masukan nama dan sandi untuk masuk ke halaman.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} autoComplete="off">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#2C3192]">
                Nama
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan Nama"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-[#2C3192] focus:border-[#EC1F25]"
              />
              {formErrors.username && (
                <p className="text-red-500 text-sm">{formErrors.username[0]}</p>
              )}
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password" className="text-[#2C3192]">
                Sandi
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Masukkkan Sandi"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[#2C3192] focus:border-[#EC1F25]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-[#2C3192]"
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
            <Button
              type="submit"
              className="w-full text-white"
              disabled={loading}
            >
              {loading ? "Menunggu..." : "Masuk"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}