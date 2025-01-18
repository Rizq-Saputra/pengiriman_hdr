import Image from "next/image";
export function Footer({ children }) {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center space-x-3 cursor-pointer mb-3">
            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              <Image
                width={32}
                height={32}
                src="/logo.png"
                alt="Logo UD Haderah"
              />
            </div>
            <span className="text-xl font-bold">UD Haderah</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Pengiriman App. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Jl. KH Wahid Hasyim 2 Gang Mawar No.22, Samarinda
          </p>
          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </footer>
  );
}
