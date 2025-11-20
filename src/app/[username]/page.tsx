import { notFound } from "next/navigation";
import Image from "next/image";
import {
  FaInstagram,
  FaYoutube,
  FaStrava,
  FaTwitter,
  FaLinkedin,
  FaTiktok
} from "react-icons/fa";
import LinkTracker from "@/components/link-tracker";
import { ExternalLink } from "lucide-react";
import prisma from "@/lib/prisma";

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

  const themeColor = data.themeColor || "#000000";

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans">
      <div className="w-full max-w-[480px] bg-white min-h-screen shadow-xl flex flex-col pb-12">
       
        <header className="flex flex-col items-center pt-12 px-6 text-center">
            <div className="relative w-28 h-28 rounded-full p-1 bg-white shadow-md mb-4">
                <div 
                  className="absolute inset-0 rounded-full opacity-20" 
                  style={{ backgroundColor: themeColor }} 
                />
                <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-100">
                  {data.avatarUrl ? (
                    <Image
                      src={data.avatarUrl}
                      alt={data.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 120px"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-300">
                      {data.name.charAt(0)}
                    </div>
                  )}
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{data.name}</h1>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-[320px] mx-auto">{data.bio}</p>
        </header>

        <div className="flex justify-center gap-4 mt-6 flex-wrap px-6">
            {data.socialLinks?.showInsta && (
              <a href={data.socialLinks.instagram || '#'} target="_blank" className="text-[#E1306C] hover:scale-110 transition-transform duration-200 bg-pink-50 p-3 rounded-full hover:bg-pink-100">
                <FaInstagram size={24} />
              </a>
            )}
            {data.socialLinks?.showYoutube && (
              <a href={data.socialLinks.youtube || '#'} target="_blank" className="text-[#FF0000] hover:scale-110 transition-transform duration-200 bg-red-50 p-3 rounded-full hover:bg-red-100">
                <FaYoutube size={24} />
              </a>
            )}
            {data.socialLinks?.showStrava && (
               <a href={data.socialLinks.strava || '#'} target="_blank" className="text-[#FC4C02] hover:scale-110 transition-transform duration-200 bg-orange-50 p-3 rounded-full hover:bg-orange-100">
                <FaStrava size={24} />
               </a>
            )}
            {data.socialLinks?.showTiktok && (
               <a href={data.socialLinks.tiktok || '#'} target="_blank" className="text-black hover:scale-110 transition-transform duration-200 bg-gray-100 p-3 rounded-full hover:bg-gray-200">
                <FaTiktok size={22} />
               </a>
            )}
            {data.socialLinks?.showTwitter && (
               <a href={data.socialLinks.twitter || '#'} target="_blank" className="text-[#1DA1F2] hover:scale-110 transition-transform duration-200 bg-blue-50 p-3 rounded-full hover:bg-blue-100">
                <FaTwitter size={24} />
               </a>
            )}
             {data.socialLinks?.showLinkedin && (
               <a href={data.socialLinks.linkedin || '#'} target="_blank" className="text-[#0077B5] hover:scale-110 transition-transform duration-200 bg-sky-50 p-3 rounded-full hover:bg-sky-100">
                <FaLinkedin size={24} />
               </a>
            )}
        </div>

        <div className="w-full px-8 mt-8 mb-6">
          <div className="h-px bg-gray-100 w-full"></div>
        </div>

        {data.coupons.length > 0 && (
          <div className="px-4 mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">
                Cupons & Descontos
              </h2>
              <div className="space-y-3">
                  {data.coupons.map(coupon => (
                    <LinkTracker 
                        key={coupon.id}
                        id={coupon.id}
                        type="coupon"
                        code={coupon.code}
                        url={coupon.link}
                        className="cursor-pointer block transform transition-all active:scale-[0.98]"
                    >
                      <div className="relative overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all group">
                          <div 
                            className="absolute left-0 top-0 bottom-0 w-1.5" 
                            style={{ backgroundColor: themeColor }}
                          />
                          
                          <div className="p-4 pl-5 flex justify-between items-center">
                              <div className="flex flex-col">
                                  <span className="font-bold text-gray-800 text-sm">{coupon.storeName}</span>
                                  <span className="text-xs text-gray-500 font-medium mt-0.5">{coupon.discount}</span>
                              </div>
                              
                              <div 
                                className="px-3 py-1.5 rounded-md text-xs font-mono font-bold bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-gray-200 transition-colors"
                                style={{ color: themeColor }}
                              >
                                  {coupon.code}
                              </div>
                          </div>
                      </div>
                    </LinkTracker>
                  ))}
              </div>
          </div>
        )}

        {data.products.length > 0 && (
          <div className="px-4 mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">
                Recomendações
              </h2>
              <div className="grid gap-3">
                  {data.products.map(product => (
                      <LinkTracker
                        key={product.id}
                        id={product.id}
                        type="product"
                        url={product.affiliateUrl}
                        className="block transform transition-all active:scale-[0.98]"
                      >
                        <div className="relative overflow-hidden bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group h-full">
                            <div 
                                className="absolute left-0 top-0 bottom-0 w-1.5" 
                                style={{ backgroundColor: themeColor }}
                            />

                            <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100 ml-2">
                                  {product.imageUrl ? (
                                    <Image
                                      src={product.imageUrl}
                                      alt={product.title}
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                                      sizes="64px"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full w-full text-gray-300">
                                      <ExternalLink size={20} />
                                    </div>
                                  )}
                            </div>
                            
                            <div className="flex-1 min-w-0 py-1">
                                  <h3 className="font-semibold text-gray-800 text-sm leading-tight truncate pr-2">
                                    {product.title}
                                  </h3>
                                  {product.description && (
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1 pr-2">
                                        {product.description}
                                    </p>
                                  )}
                                  {product.price && (
                                    <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 group-hover:bg-gray-100 transition-colors">
                                        {product.price}
                                    </span>
                                  )}
                            </div>
                        </div>
                      </LinkTracker>
                  ))}
              </div>
          </div>
        )}

        {data.partners.length > 0 && (
          <div className="px-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">
                Parceiros
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {data.partners.map(partner => (
                <LinkTracker
                  key={partner.id}
                  id={partner.id}
                  type="partner"
                  url={partner.siteUrl}
                  className="block transform transition-all active:scale-[0.98]"
                >
                  <div className="relative overflow-hidden flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all h-28 group">
                    <div 
                        className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ backgroundColor: themeColor }}
                    />
                    
                    {partner.logoUrl ? (
                      <div className="relative w-full h-12 mb-2">
                         <Image 
                            src={partner.logoUrl} 
                            alt={partner.name}
                            fill
                            className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 p-1"
                            sizes="150px"
                         />
                      </div>
                    ) : (
                       <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2 text-gray-400 font-bold text-xs">
                          {partner.name.charAt(0)}
                       </div>
                    )}
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide group-hover:text-gray-800 transition-colors mt-auto">
                        {partner.name}
                    </span>
                  </div>
                </LinkTracker>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-auto pt-12 pb-6 text-center">
           <p className="text-[10px] text-gray-400 font-medium flex items-center justify-center gap-1">
             Powered by <span className="font-bold text-gray-600">CreatorHub</span>
           </p>
        </footer>
      </div>
    </div>
  );
}