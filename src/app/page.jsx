import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Home() {
  const produkData = [
    {
      id: 1,
      title: "Produk 1",
      description: "Deskripsi produk 1",
      imageUrl: "/product.png",
    },
    {
      id: 2,
      title: "Produk 2",
      description: "Deskripsi produk 2",
      imageUrl: "/product.png",
    },
    {
      id: 3,
      title: "Produk 3",
      description: "Deskripsi produk 3",
      imageUrl: "/product.png",
    },
    {
      id: 4,
      title: "Produk 4",
      description: "Deskripsi produk 4",
      imageUrl: "/product.png",
    },
    {
      id: 5,
      title: "Produk 5",
      description: "Deskripsi produk 5",
      imageUrl: "/product.png",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-inter">
      <header className="w-full flex justify-between md:px-40 px-10 items-center mt-10">
        <div className="flex items-center space-x-3 cursor-pointer">
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
        <Link href={"/pelanggan"}>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Lihat Pengiriman
          </button>
        </Link>
      </header>
      <main className="mt-10">
        <section className="flex flex-col md:flex-row items-center justify-between text-center px-6 w-full max-w-7xl">
          <div className="flex-1 md:text-left order-2 md:order-1">
            {" "}
            <h1 className="md:text-5xl text-3xl font-bold mb-6">
              UD Haderah Samarinda
            </h1>
            <p className="text-lg text-gray-700 mb-6 max-w-lg">
              Menjual berbagai macam bahan bangunan kayu serta melayani jasa
              pengiriman barang dengan harga yang berkualitas dan pelayanan yang
              cepat
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition mb-14">
              Baca Selengkapnya
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center mt-6 md:mt-0 order-1 md:order-2">
            <Image
              src="/truck.png"
              alt="Truk UD Haderah"
              width={800}
              height={200}
              className="inline-block"
            />
          </div>
        </section>

        <section className="flex flex-col items-center justify-center p-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-2">Masuk</h1>
            <p className="text-muted-foreground">
              Pilih sesuai bagian anda untuk masuk ke dalam website
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
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
            <Link href={"/pelanggan"}>
              <Card className="p-8 text-center hover:bg-muted transition-colors cursor-pointer flex flex-col items-center">
                <CardHeader>
                  <CardDescription>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100"
                      height="100"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="black"
                      className="lucide lucide-users-round"
                    >
                      <path d="M18 21a8 8 0 0 0-16 0" />
                      <circle cx="10" cy="8" r="5" />
                      <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
                    </svg>
                  </CardDescription>
                  <CardTitle className="text-center text-2xl">
                    Pelanggan
                  </CardTitle>
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
                  <CardTitle className="text-center text-2xl">Sopir</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </section>

        <section className="mt-16 flex flex-col items-center justify-center w-full max-w-7xl px-6 mb-10">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold mb-4">Produk Kami</h2>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full max-w-xs md:max-w-5xl"
            >
              <CarouselContent>
                {produkData.map((produk) => (
                  <CarouselItem
                    key={produk.id}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                          {/* Gambar produk */}
                          <Image
                            src={produk.imageUrl}
                            alt={produk.title}
                            width={400}
                            height={400}
                            className="rounded-md"
                          />
                          {/* Deskripsi produk */}
                          <CardHeader>
                            <CardTitle className="text-xl font-semibold">
                              {produk.title}
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                              {produk.description}
                            </CardDescription>
                          </CardHeader>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation buttons */}
              <CarouselPrevious className="hidden md:block" />
              <CarouselNext className="hidden md:block" />
            </Carousel>
          </div>
        </section>

        <section className="mt-16 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl px-6 mb-10">
          {/* Bagian Informasi */}
          <div className="flex flex-col items-center md:items-start md:w-1/2 space-y-6">
            <Link href={"https://maps.app.goo.gl/Z2vgHjiBBgc7Pxus9"}>
              <Card className="w-full max-w-md p-6 text-center transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-100">
                <CardHeader>
                  <MapPin className="mx-auto" />
                  <CardTitle className="text-xl font-semibold">
                    Alamat
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Jl. Kh Wahid Hasyim 2 Samping Perum TVRI Graha Asri
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
              <Link href={"mailto:udhaderahsempaja@gmail.com"}>
                <Card className="p-4 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-100">
                  <CardHeader>
                    <Mail className="mx-auto" />
                    <CardTitle className="text-lg font-medium">Email</CardTitle>
                    <CardDescription>
                      udhaderahsempaja@gmail.com
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href={"https://wa.me/628115631990"}>
                <Card className="p-4 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-100">
                  <CardHeader>
                    <Phone className="mx-auto" />
                    <CardTitle className="text-lg font-medium">
                      Kontak
                    </CardTitle>
                    <CardDescription>+62 811-5631-990</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>

          {/* Bagian Peta */}
          <div className="mt-10 md:mt-0 md:ml-10 md:w-1/2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.6976287183074!2d117.1526280747235!3d-0.44565699954996446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df67893dd254013%3A0xe662cb6992ddb31f!2sUD.%20Haderah%20sempaja!5e0!3m2!1sid!2sid!4v1736602185440!5m2!1sid!2sid"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </main>
    </div>
  );
}
