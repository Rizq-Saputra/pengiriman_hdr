import { notFound } from 'next/navigation';
import DeliveryDetails from './delivery-details';


export default async function DetailPengirimanPage({ params }) {
    const paramsUrl = await params;
    const id = paramsUrl.slug[0];
    const secondParam = paramsUrl.slug[1];

    if (secondParam && secondParam !== 'sopir') {
        notFound();
    }


    return <DeliveryDetails id={id} />;
}
