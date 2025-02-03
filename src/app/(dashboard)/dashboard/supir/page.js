import React from "react";
import TableClient from "./table-client";

export const metadata = {
    title: "Sopir",
};

export default async function SopirPage() {
    return (
        <div className="p-8 w-full">
            <TableClient />
        </div>
    );
}