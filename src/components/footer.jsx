export function Footer({ children }) {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Pengiriman App. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Jl. KH Wahid Hasyim 2 Gang Mawar No.22, Samarinda
          </p>
          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
} 