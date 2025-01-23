import { Instagram, Facebook, Mail, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer({ children }) {
  return (
    <footer className="mt-10 sm:mt-64 bg-[#1D1B24] w-full p-8 sm:py-10">
      <div className="mx-auto text-center">
        <div className="mx-auto text-center mb-2">
          <div className="flex items-center justify-center gap-2 text-white font-bold">
            <Image
              width={32}
              height={32}
              src="/logo.png"
              alt="Logo UD Haderah"
              className="inline-block"
            />
            <span className="text-xl font-medium text-white">UD Haderah Samarinda</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          © Copyright 2025 UD Haderah Samarinda.
        </p>
        <p className="text-xs text-muted-foreground mt-1 mb-2">
          Jl. KH Wahid Hasyim 2 Samping Perum TVRI No.22, Samarinda Utara
        </p>
        <ul className="flex justify-center text-white gap-3 sm:gap-4 sm:mt-10">
          <li className="size-10 rounded-full bg-primary cursor-pointer justify-center items-center flex hover:text-[#0e0e0e] hover:bg-white hover:transition-all hover:ease-in-out hover:duration-500">
            <Link
              href="https://www.instagram.com/ud.haderahsempaja/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="text-lg sm:text-xl" />
            </Link>
          </li>
          <li className="size-10 rounded-full bg-primary cursor-pointer justify-center items-center flex hover:text-[#0e0e0e] hover:bg-white hover:transition-all hover:ease-in-out hover:duration-500">
            <Link
              href="https://www.facebook.com/profile.php?id=61551792994230"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook className="text-lg sm:text-xl" />
            </Link>
          </li>
          <li className="size-10 rounded-full bg-primary cursor-pointer justify-center items-center flex hover:text-[#0e0e0e] hover:bg-white hover:transition-all hover:ease-in-out hover:duration-500">
            <Link
              href="https://wa.me/628115631990"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Phone"
            >
              <Phone className="text-lg sm:text-xl" />
            </Link>
          </li>
          <li className="size-10 rounded-full bg-primary cursor-pointer justify-center items-center flex hover:text-[#0e0e0e] hover:bg-white hover:transition-all hover:ease-in-out hover:duration-500">
            <Link
              href="mailto:udhaderahsempaja@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email"
            >
              <Mail className="text-lg sm:text-xl" />
            </Link>
          </li>
        </ul>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </footer>
  );
}
