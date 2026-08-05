import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { contactApi } from "@/features/contact/api/contactApi";
import type { ContactRequestDto } from "@/features/contact/types";

export function PropertyInquiriesPage() {
  const { id } = useParams<{ id: string }>();
  const [inquiries, setInquiries] = useState<ContactRequestDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    contactApi.getForProperty(id).then((data) => {
      setInquiries(data);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return <div className="p-16 text-center text-mute">Loading inquiries…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="font-display text-2xl text-ink">
        {inquiries[0]?.propertyTitle ?? "Inquiries"}
      </h1>

      {inquiries.length === 0 && (
        <p className="mt-8 text-center text-sm text-mute">No messages yet for this listing.</p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="rounded-card border border-line bg-paper p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-ink">{inquiry.buyerName}</p>
              <span className="text-xs text-mute">
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-mute">{inquiry.buyerEmail}</p>
            <p className="mt-2 text-sm text-ink">{inquiry.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}