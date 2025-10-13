"use client";
import OfferForm from '@/Components/admin/OfferForm';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const UpdateOfferPage = () => {
  const params = useParams(); // get dynamic route params
  const offerId = params?.id as string;

  const [offer, setOffer] = useState<{
    id: string;
    title: string;
    subtitle?: string;
    date: string;
  } | null>(null);

  useEffect(() => {
    if (!offerId) return;

    const fetchOffer = async () => {
      try {
        const res = await fetch(`/api/offer/${offerId}`);
        const data = await res.json();
        if (res.ok) {
          setOffer(data);
        } else {
          console.error(data.error || 'Failed to fetch offer');
        }
      } catch (err) {
        console.error('Error fetching offer:', err);
      }
    };

    fetchOffer();
  }, [offerId]);

  // Wait until the offer is loaded
  if (!offer) return <p className="p-4">Loading offer...</p>;

  return <OfferForm id={offerId} mode="update" offer={offer} />;
};

export default UpdateOfferPage;