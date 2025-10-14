"use client";

import BannerForm from '@/Components/admin/BannerForm';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

const Page = () => {
  const params = useParams();
  const id = params?.id as string;
  
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBanner = async () => {
      setLoading(true);
      try {
        console.log("Fetching banner with ID:", id);
        const res = await fetch(`/api/banners/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch banner");
        }

        const data = await res.json();
        console.log("Fetched banner data:", data);
        
        // Handle different response structures
        const bannerData = data.banner || data.data || data;
        setBanner(bannerData);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load banner");
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading banner...</p>
        </div>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Banner not found</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  return <BannerForm mode="update" id={id} banner={banner} />;
};

export default Page;