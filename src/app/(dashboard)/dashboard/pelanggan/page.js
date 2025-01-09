import React from "react";
import TableClient from "./table-client";

export const metadata = {
    title: "Pelanggan",
};

export default async function Pelanggan() {
    return (
        <div className="p-8 w-full">
            <TableClient />
        </div>
    );
}