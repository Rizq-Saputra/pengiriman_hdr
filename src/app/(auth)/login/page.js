import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { VeryTopBackButton } from "@/components/ui/very-top-back-button";
import Link from "next/link";

export const metadata = {
  title: "Choose Login",
};

export default function ChooseLogin() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <VeryTopBackButton />
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold mb-2">Masuk</h1>
        <p className="text-muted-foreground">
          Pilih sesuai bagian anda untuk masuk ke dalam website
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link href={"/login/admin"}>
          <Card className="p-8 text-center hover:bg-muted transition-colors cursor-pointer flex flex-col items-center">
            <CardHeader>
              <CardDescription>
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M83.3334 87.5V79.1667C83.3334 74.7464 81.5774 70.5072 78.4518 67.3816C75.3262 64.2559 71.087 62.5 66.6667 62.5H33.3334C28.9131 62.5 24.6738 64.2559 21.5482 67.3816C18.4226 70.5072 16.6667 74.7464 16.6667 79.1667V87.5M66.6667 29.1667C66.6667 38.3714 59.2048 45.8333 50 45.8333C40.7953 45.8333 33.3334 38.3714 33.3334 29.1667C33.3334 19.9619 40.7953 12.5 50 12.5C59.2048 12.5 66.6667 19.9619 66.6667 29.1667Z"
                    stroke="#1E1E1E"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </CardDescription>
              <CardTitle className="text-2xl text-center">Admin</CardTitle>
            </CardHeader>
          </Card>
        </Link>
        <Link href={"/login/driver"}>
          <Card className="p-8 text-center hover:bg-muted transition-colors cursor-pointer flex flex-col items-center">
            <CardHeader>
              <CardDescription>
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.6667 60.4166V50.7113C16.6667 45.9967 20.3976 42.1747 25 42.1747M16.6667 60.4166C16.6667 65.1312 20.3976 68.9532 25 68.9532H75C79.6024 68.9532 83.3333 65.1312 83.3333 60.4166M16.6667 60.4166V73.4755C16.6667 76.6186 19.154 79.1666 22.2222 79.1666H27.7778C30.846 79.1666 33.3333 76.6186 33.3333 73.4755V68.9532M83.3333 60.4166V50.7113C83.3333 45.9967 79.6024 42.1747 75 42.1747H25M83.3333 60.4166V73.4755C83.3333 76.6186 80.846 79.1666 77.7778 79.1666H72.2222C69.154 79.1666 66.6667 76.6186 66.6667 73.4755V68.9532M25 42.1747L29.4558 25.0579C30.1043 22.5667 32.3068 20.8333 34.8238 20.8333H65.4402C67.8315 20.8333 69.9545 22.4007 70.7107 24.7246L76.3889 42.1747M26.3889 54.9796H36.1111M63.8889 54.9796H73.6111"
                    stroke="black"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </CardDescription>
              <CardTitle className="text-center text-2xl">Driver</CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
