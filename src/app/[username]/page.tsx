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
import { THEMES, ThemeKey } from "@/lib/themes";

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
  
  const themeKey = (data.theme as ThemeKey) || "light";
  const theme = THEMES[themeKey] || THEMES.light;

  const s = data.socialLinks; 

  const SocialIcon = ({ show, link, icon: Icon, color }: any) => {
    if (!show || !link) return null;
    return (
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`hover:scale-110 transition-transform duration-200 p-3 rounded-full flex items-center justify-center ${themeKey === 'light' ? 'bg-transparent hover:bg-gray-100' : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'}`}
        title={link}
      >
         <Icon size={24} style={{ color: themeKey !== 'light' ? 'white' : color }} />
      </a>
    );
  };

  return (
    <div className={`min-h-screen flex justify-center font-sans transition-colors duration-500 ${theme.bgClass} ${theme.textClass}`}>
      
      <div className={`w-full max-w-[480px] min-h-screen flex flex-col pb-12 shadow-xl transition-all duration-500 ${themeKey === 'light' ? 'bg-white' : 'bg-transparent'}`}>
       
        {/* --- CABEÇALHO --- */}
        <header className="flex flex-col items-center pt-12 px-6 text-center">
            {/* ADICIONADO: boxShadow dinâmico com a cor do tema */}
            <div 
                className="relative w-28 h-28 rounded-full p-1 mb-4 transition-shadow duration-300"
                // Adiciona um "glow" colorido e translúcido ao redor da foto
                style={{ boxShadow: `0 0 30px 5px ${themeColor}60` }}
            >
                {/* Removi sombras genéricas internas para dar destaque ao glow colorido */}
                <div className={`relative w-full h-full rounded-full overflow-hidden border-4 ${themeKey === 'light' ? 'border-white' : 'border-white/20'}`}>
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
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-gray-200 text-gray-500">
                      {data.name.charAt(0)}
                    </div>
                  )}
                </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{data.name}</h1>
            <p className={`text-sm mt-2 leading-relaxed max-w-[320px] mx-auto ${themeKey === 'light' ? 'text-gray-500' : 'text-white/80'}`}>
                {data.bio}
            </p>
        </header>

        {/* --- REDES SOCIAIS --- */}
        <div className="flex justify-center gap-3 mt-6 flex-wrap px-6">
            <SocialIcon show={s?.showInsta} link={s?.instagram} icon={FaInstagram} color="#E1306C" />
            <SocialIcon show={s?.showTiktok} link={s?.tiktok} icon={FaTiktok} color="#000000" />
            <SocialIcon show={s?.showYoutube} link={s?.youtube} icon={FaYoutube} color="#FF0000" />
            <SocialIcon show={s?.showFacebook} link={s?.facebook} icon={FaFacebook} color="#1877F2" />
            <SocialIcon show={s?.showTwitter} link={s?.twitter} icon={FaTwitter} color="#1DA1F2" />
            <SocialIcon show={s?.showLinkedin} link={s?.linkedin} icon={FaLinkedin} color="#0A66C2" />
            <SocialIcon show={s?.showPinterest} link={s?.pinterest} icon={FaPinterest} color="#BD081C" />
            
            <SocialIcon show={s?.showWhatsapp} link={s?.whatsapp} icon={FaWhatsapp} color="#25D366" />
            <SocialIcon show={s?.showTelegram} link={s?.telegram} icon={FaTelegram} color="#0088CC" />
            <SocialIcon show={s?.showDiscord} link={s?.discord} icon={FaDiscord} color="#5865F2" />
            
            <SocialIcon show={s?.showTwitch} link={s?.twitch} icon={FaTwitch} color="#9146FF" />
            <SocialIcon show={s?.showStrava} link={s?.strava} icon={FaStrava} color="#FC4C02" />
            <SocialIcon show={s?.showSnapchat} link={s?.snapchat} icon={FaSnapchatGhost} color="#FFFC00" />
            <SocialIcon show={s?.showGithub} link={s?.github} icon={FaGithub} color="#181717" />
            
            <SocialIcon show={s?.showKwai} link={s?.kwai} icon={SiKuaishou} color="#FF8F00" />
            <SocialIcon show={s?.showVsco} link={s?.vsco} icon={SiVsco} color="#000000" />
            <SocialIcon show={s?.showOnlyfans} link={s?.onlyfans} icon={SiOnlyfans} color="#00AFF0" />
        </div>

        <div className="w-full px-8 mt-8 mb-6">
          <div className={`h-px w-full ${themeKey === 'light' ? 'bg-gray-100' : 'bg-white/20'}`}></div>
        </div>

        {/* --- CUPONS --- */}
        {data.coupons.length > 0 && (
          <div className="px-4 mb-8">
              <h2 className={`text-xs font-bold uppercase tracking-widest mb-3 ml-1 ${themeKey === 'light' ? 'text-gray-400' : 'text-white/60'}`}>
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
                      <div className={`relative overflow-hidden rounded-xl transition-all group ${theme.cardClass}`}>
                          <div 
                            className="absolute left-0 top-0 bottom-0 w-1.5" 
                            style={{ backgroundColor: themeColor }}
                          />
                          
                          <div className="p-4 pl-5 flex justify-between items-center">
                              <div className="flex flex-col">
                                  <span className={`font-bold text-sm ${theme.textClass}`}>{coupon.storeName}</span>
                                  <span className={`text-xs font-medium mt-0.5 ${themeKey === 'light' ? 'text-gray-500' : 'text-white/70'}`}>
                                    {coupon.discount}
                                  </span>
                              </div>
                              
                              <div 
                                className="px-3 py-1.5 rounded-md text-xs font-mono font-bold border transition-colors"
                                style={{ 
                                    color: themeColor,
                                    borderColor: themeKey === 'light' ? '#f3f4f6' : 'rgba(255,255,255,0.2)',
                                    backgroundColor: themeKey === 'light' ? '#f9fafb' : 'rgba(255,255,255,0.1)'
                                }}
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

        {/* --- PRODUTOS --- */}
        {data.products.length > 0 && (
          <div className="px-4 mb-8">
              <h2 className={`text-xs font-bold uppercase tracking-widest mb-3 ml-1 ${themeKey === 'light' ? 'text-gray-400' : 'text-white/60'}`}>
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
                        <div className={`relative overflow-hidden rounded-xl p-3 transition-all flex items-center gap-4 group h-full ${theme.cardClass}`}>
                            <div 
                                className="absolute left-0 top-0 bottom-0 w-1.5" 
                                style={{ backgroundColor: themeColor }}
                            />

                            <div className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border ml-2 ${themeKey === 'light' ? 'bg-gray-50 border-gray-100' : 'bg-white/10 border-white/10'}`}>
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
                                  <h3 className={`font-semibold text-sm leading-tight truncate pr-2 ${theme.textClass}`}>
                                    {product.title}
                                  </h3>
                                  {product.description && (
                                    <p className={`text-xs mt-1 line-clamp-1 pr-2 ${themeKey === 'light' ? 'text-gray-500' : 'text-white/70'}`}>
                                        {product.description}
                                    </p>
                                  )}
                                  {product.price && (
                                    <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${themeKey === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-white/20 text-white'}`}>
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

        {/* --- PARCEIROS --- */}
        {data.partners.length > 0 && (
          <div className="px-4">
            <h2 className={`text-xs font-bold uppercase tracking-widest mb-3 ml-1 ${themeKey === 'light' ? 'text-gray-400' : 'text-white/60'}`}>
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
                  <div className={`relative overflow-hidden flex flex-col items-center justify-center p-4 rounded-xl border transition-all h-28 group ${themeKey === 'light' ? 'bg-white border-gray-100 shadow-sm hover:shadow-md' : 'bg-white/10 border-white/10 backdrop-blur-sm hover:bg-white/20'}`}>
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
                            className={`object-contain transition-all duration-300 p-1 ${themeKey === 'light' ? 'filter grayscale group-hover:grayscale-0' : ''}`}
                            sizes="150px"
                         />
                      </div>
                    ) : (
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 text-xs font-bold ${themeKey === 'light' ? 'bg-gray-50 text-gray-400' : 'bg-white/20 text-white'}`}>
                          {partner.name.charAt(0)}
                       </div>
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-wide mt-auto transition-colors ${themeKey === 'light' ? 'text-gray-400 group-hover:text-gray-800' : 'text-white/70 group-hover:text-white'}`}>
                        {partner.name}
                    </span>
                  </div>
                </LinkTracker>
              ))}
            </div>
          </div>
        )}

        {/* --- RODAPÉ --- */}
        <footer className="mt-auto pt-12 pb-24 text-center">
           <p className={`text-[10px] font-medium flex items-center justify-center gap-1 ${themeKey === 'light' ? 'text-gray-400' : 'text-white/40'}`}>
             Powered by <span className="font-bold">CreatorHub</span>
           </p>
        </footer>

        {/* --- CTA FLUTUANTE --- */}
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