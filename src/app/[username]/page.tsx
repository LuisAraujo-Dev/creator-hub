import { notFound } from "next/navigation";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import {
  FaInstagram,
  FaYoutube,
  FaStrava,
  FaTwitter,
  FaLinkedin,
  FaTiktok
} from "react-icons/fa";
import prisma from "@/lib/prisma";
import LinkTracker from "@/components/link-tracker";


interface PageProps {
  params: { username: string };
}

async function getData(username: string) {
  const user = await prisma.user.findUnique({
    where: { username: username },
    include: {
      socialLinks: true,
      products: { where: { active: true }, orderBy: { createdAt: 'desc' } },
      coupons: { where: { active: true }, orderBy: { createdAt: 'desc' } },
      partners: { where: { active: true }, orderBy: { createdAt: 'desc' } },
    },
  });
  if (!user) return null;
  return user;
}

export default async function UserProfile({ params }: PageProps) {
  const { username } = await Promise.resolve(params); 
  
  const data = await getData(username);
  if (!data) return notFound();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen shadow-2xl flex flex-col">
       
        <header className="flex flex-col items-center pt-10 px-6 text-center">
            <div className="relative w-24 h-24 rounded-full bg-gray-300 overflow-hidden mb-4 border-4 border-white shadow-lg">
                {data.avatarUrl ? (
                  <Image
                    src={data.avatarUrl}
                    alt={data.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 96px"
                  />
                ) : (
                   <div className="w-full h-full flex items-center justify-center bg-gray-200 text-2xl font-bold text-gray-500">
                     {data.name.charAt(0)}
                   </div>
                )}
            </div>
            <h1 className="text-xl font-bold text-gray-900">{data.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{data.bio}</p>
        </header>

        <div className="flex justify-center gap-4 mt-6 flex-wrap px-4">
            {data.socialLinks?.showInsta && (
              <a href={data.socialLinks.instagram || '#'} target="_blank" className="hover:scale-110 transition text-pink-600">
                <FaInstagram size={24} />
              </a>
            )}
            {data.socialLinks?.showYoutube && (
              <a href={data.socialLinks.youtube || '#'} target="_blank" className="hover:scale-110 transition text-red-600">
                <FaYoutube size={24} />
              </a>
            )}
            {data.socialLinks?.showStrava && (
               <a href={data.socialLinks.strava || '#'} target="_blank" className="hover:scale-110 transition text-orange-500">
                <FaStrava size={24} />
               </a>
            )}
            {data.socialLinks?.showTiktok && (
               <a href={data.socialLinks.tiktok || '#'} target="_blank" className="hover:scale-110 transition text-black">
                <FaTiktok size={24} />
               </a>
            )}
            {data.socialLinks?.showTwitter && (
               <a href={data.socialLinks.twitter || '#'} target="_blank" className="hover:scale-110 transition text-blue-400">
                <FaTwitter size={24} />
               </a>
            )}
             {data.socialLinks?.showLinkedin && (
               <a href={data.socialLinks.linkedin || '#'} target="_blank" className="hover:scale-110 transition text-blue-700">
                <FaLinkedin size={24} />
               </a>
            )}
        </div>

        {data.coupons.length > 0 && (
          <div className="mt-8 px-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Cupons Exclusivos</h2>
              <div className="space-y-3">
                  {data.coupons.map(coupon => (
                    <LinkTracker 
                        key={coupon.id}
                        id={coupon.id}
                        type="coupon"
                        code={coupon.code}
                        url={coupon.link}
                        className="cursor-pointer"
                    >
                      <div className="border border-dashed border-orange-300 bg-orange-50 p-3 rounded-lg flex justify-between items-center group hover:bg-orange-100 transition relative">
                          <div>
                              <p className="font-bold text-orange-800">{coupon.storeName}</p>
                              <p className="text-xs text-orange-600">{coupon.discount}</p>
                          </div>
                          <div className="bg-white px-3 py-1 rounded border border-orange-200 text-sm font-mono font-bold text-gray-700 group-hover:scale-105 transition">
                              {coupon.code}
                          </div>
                      </div>
                    </LinkTracker>
                  ))}
              </div>
          </div>
        )}

        {/* PRODUTOS */}
        {data.products.length > 0 && (
          <div className="mt-8 px-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Meus Equipamentos</h2>
              <div className="grid gap-4">
                  {data.products.map(product => (
                      <LinkTracker
                        key={product.id}
                        id={product.id}
                        type="product"
                        url={product.affiliateUrl}
                        className="block"
                      >
                        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100 group bg-white shadow-sm cursor-pointer">
                            <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                  {product.imageUrl ? (
                                    <Image
                                      src={product.imageUrl}
                                      alt={product.title}
                                      fill
                                      className="object-cover group-hover:scale-110 transition duration-500"
                                      sizes="64px"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full w-full text-gray-400">
                                      <ExternalLink size={20} />
                                    </div>
                                  )}
                            </div>
                            <div className="flex-1">
                                  <h3 className="font-semibold text-gray-800 text-sm leading-tight">{product.title}</h3>
                                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                                  {product.price && <span className="text-xs font-bold text-green-600 mt-2 block bg-green-50 w-fit px-2 py-0.5 rounded">{product.price}</span>}
                            </div>
                        </div>
                      </LinkTracker>
                  ))}
              </div>
          </div>
        )}

        {data.partners.length > 0 && (
          <div className="mt-8 px-4 pb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Parceiros Oficiais</h2>
            <div className="grid grid-cols-2 gap-3">
              {data.partners.map(partner => (
                <LinkTracker
                  key={partner.id}
                  id={partner.id}
                  type="partner"
                  url={partner.siteUrl}
                  className="block"
                >
                  <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition group h-full">
                    {partner.logoUrl ? (
                      <div className="relative w-full h-12 mb-2">
                         <Image 
                            src={partner.logoUrl} 
                            alt={partner.name}
                            fill
                            className="object-contain group-hover:scale-105 transition"
                            sizes="150px"
                         />
                      </div>
                    ) : (
                       <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2 text-gray-400 font-bold">
                          {partner.name.charAt(0)}
                       </div>
                    )}
                    <span className="text-xs font-semibold text-gray-700 text-center">{partner.name}</span>
                  </div>
                </LinkTracker>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-auto py-6 text-center text-xs text-gray-400">
           <p>© {new Date().getFullYear()} CreatorHub</p>
        </footer>
      </div>
    </div>
  );
}