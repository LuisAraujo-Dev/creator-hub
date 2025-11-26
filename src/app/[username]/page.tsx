import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";
import {
  FaInstagram, FaYoutube, FaStrava, FaTwitter, FaLinkedin, FaTiktok,
  FaFacebook, FaPinterest, FaTelegram, FaDiscord, FaTwitch, FaSnapchatGhost, FaGithub, FaWhatsapp
} from "react-icons/fa";
import { SiKuaishou, SiVsco, SiOnlyfans } from "react-icons/si"; 
import LinkTracker from "@/components/link-tracker";
import { ExternalLink } from "lucide-react";
import prisma from "@/lib/prisma";

interface PageProps {
  params: { username: string };
}

async function getUser(username: string) {
  return await prisma.user.findUnique({
    where: { username: username },
    include: {
      socialLinks: true,
      products: { where: { active: true }, orderBy: { createdAt: 'desc' } },
      coupons: { where: { active: true }, orderBy: { createdAt: 'desc' } },
      partners: { where: { active: true }, orderBy: { createdAt: 'desc' } },
    },
  });
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const username = params.username;
  const user = await getUser(username);

  if (!user) {
    return {
      title: "Usuário não encontrado | CreatorHub",
    };
  }

  return {
    title: `${user.name} | CreatorHub`,
    description: user.bio || `Confira os links e recomendações de ${user.name}.`,
    openGraph: {
      title: `${user.name} no CreatorHub`,
      description: user.bio || `Veja meus produtos favoritos e cupons exclusivos.`,
      images: user.avatarUrl ? [user.avatarUrl] : [],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: user.name,
      description: user.bio || "",
      images: user.avatarUrl ? [user.avatarUrl] : [],
    }
  };
}

export default async function UserProfile({ params }: PageProps) {
  const { username } = params; 
  
  const data = await getUser(username);
  if (!data) return notFound();

  const themeColor = data.themeColor || "#000000";
  const s = data.socialLinks; 

  const SocialIcon = ({ show, link, icon: Icon, color, bgClass }: any) => {
    if (!show || !link) return null;
    return (
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`text-[${color}] hover:scale-110 transition-transform duration-200 p-3 rounded-full ${bgClass} flex items-center justify-center`}
        title={link}
      >
         <Icon size={24} style={{ color: color }} />
      </a>
    );
  };

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

        <div className="flex justify-center gap-3 mt-6 flex-wrap px-6">
            <SocialIcon show={s?.showInsta} link={s?.instagram} icon={FaInstagram} color="#E1306C" bgClass="hover:bg-pink-50" />
            <SocialIcon show={s?.showTiktok} link={s?.tiktok} icon={FaTiktok} color="#000000" bgClass="hover:bg-gray-100" />
            <SocialIcon show={s?.showYoutube} link={s?.youtube} icon={FaYoutube} color="#FF0000" bgClass="hover:bg-red-50" />
            <SocialIcon show={s?.showFacebook} link={s?.facebook} icon={FaFacebook} color="#1877F2" bgClass="hover:bg-blue-50" />
            <SocialIcon show={s?.showTwitter} link={s?.twitter} icon={FaTwitter} color="#1DA1F2" bgClass="hover:bg-sky-50" />
            <SocialIcon show={s?.showLinkedin} link={s?.linkedin} icon={FaLinkedin} color="#0A66C2" bgClass="hover:bg-blue-50" />
            <SocialIcon show={s?.showPinterest} link={s?.pinterest} icon={FaPinterest} color="#BD081C" bgClass="hover:bg-red-50" />
            
            <SocialIcon show={s?.showWhatsapp} link={s?.whatsapp} icon={FaWhatsapp} color="#25D366" bgClass="hover:bg-green-50" />
            <SocialIcon show={s?.showTelegram} link={s?.telegram} icon={FaTelegram} color="#0088CC" bgClass="hover:bg-sky-50" />
            <SocialIcon show={s?.showDiscord} link={s?.discord} icon={FaDiscord} color="#5865F2" bgClass="hover:bg-indigo-50" />
            
            <SocialIcon show={s?.showTwitch} link={s?.twitch} icon={FaTwitch} color="#9146FF" bgClass="hover:bg-purple-50" />
            <SocialIcon show={s?.showStrava} link={s?.strava} icon={FaStrava} color="#FC4C02" bgClass="hover:bg-orange-50" />
            <SocialIcon show={s?.showSnapchat} link={s?.snapchat} icon={FaSnapchatGhost} color="#FFFC00" bgClass="hover:bg-yellow-50" />
            <SocialIcon show={s?.showGithub} link={s?.github} icon={FaGithub} color="#181717" bgClass="hover:bg-gray-100" />
            
            <SocialIcon show={s?.showKwai} link={s?.kwai} icon={SiKuaishou} color="#FF8F00" bgClass="hover:bg-orange-50" />
            <SocialIcon show={s?.showVsco} link={s?.vsco} icon={SiVsco} color="#000000" bgClass="hover:bg-gray-100" />
            <SocialIcon show={s?.showOnlyfans} link={s?.onlyfans} icon={SiOnlyfans} color="#00AFF0" bgClass="hover:bg-sky-50" />
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
                                    <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors">
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

        <footer className="mt-auto pt-12 pb-24 text-center">
           <p className="text-[10px] text-gray-400 font-medium flex items-center justify-center gap-1">
             Powered by <span className="font-bold text-gray-600">CreatorHub</span>
           </p>
        </footer>

        <div className="fixed bottom-4 left-0 right-0 flex justify-center px-4 z-50 pointer-events-none">
            <div className="bg-gray-900/90 backdrop-blur-md text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-4 pointer-events-auto transform transition-all hover:scale-105 hover:bg-gray-900 border border-white/10 max-w-md w-full justify-between">
                <div className="flex flex-col text-left">
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Gostou do perfil?</span>
                    <span className="text-xs font-bold">Crie seu CreatorHub grátis</span>
                </div>
                <a 
                    href="/" 
                    className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                    Começar
                </a>
            </div>
        </div>

      </div>
    </div>
  );
}