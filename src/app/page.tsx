import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap, Star, Shield, LayoutTemplate, Palette } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">C</div>
            CreatorHub
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-blue-600 transition">Recursos</Link>
            <Link href="#pricing" className="hover:text-blue-600 transition">Preços</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium hover:underline hidden sm:block">
              Entrar
            </Link>
            <Link href="/sign-up">
              <Button>Começar Grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        
        {/* --- HERO --- */}
        <section className="py-20 md:py-32 text-center px-4 bg-linear-to-b from-blue-50/50 to-white">
          <div className="container mx-auto max-w-4xl">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200 mb-6">
              ✨ A nova forma de monetizar sua bio
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
              Um único link para <br className="hidden md:block"/> 
              <span className="text-blue-600">todos os seus ganhos.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Centralize suas redes sociais, recomende produtos e compartilhe cupons de desconto. 
              Transforme seguidores em clientes em segundos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="h-12 px-8 text-base w-full sm:w-auto">
                  Criar minha página <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {/* Ajuste o user abaixo para o seu user oficial se quiser */}
              <Link href="/luisrun"> 
                <Button variant="outline" size="lg" className="h-12 px-8 text-base w-full sm:w-auto">
                  Ver exemplo ao vivo
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-500">Não requer cartão de crédito • Plano grátis para sempre</p>
          </div>
        </section>

        {/* --- FEATURES --- */}
        <section id="features" className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Tudo o que você precisa</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Não é apenas um link na bio. É uma mini landing page focada em conversão.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <FeatureCard 
                icon={<Zap className="h-6 w-6 text-yellow-500" />}
                title="Produtos Afiliados"
                description="Liste seus produtos da Amazon, Shopee ou Hotmart com imagem e preço."
              />
              <FeatureCard 
                icon={<Star className="h-6 w-6 text-purple-500" />}
                title="Cupons de Desconto"
                description="Disponibilize códigos de desconto fáceis de copiar para sua audiência."
              />
              <FeatureCard 
                icon={<LayoutTemplate className="h-6 w-6 text-pink-500" />}
                title="Parceiros & Logos"
                description="Dê destaque visual para as marcas que patrocinam o seu conteúdo."
              />
              <FeatureCard 
                icon={<Shield className="h-6 w-6 text-blue-500" />}
                title="Analytics Simples"
                description="Saiba exatamente quantos cliques cada produto recebeu e otimize."
              />
            </div>
          </div>
        </section>

        {/* --- PRICING --- */}
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Planos Simples</h2>
              <p className="text-slate-600">Comece grátis e cresça conforme sua audiência aumenta.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* FREE PLAN */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-2">Starter</h3>
                <div className="text-4xl font-extrabold mb-6">R$ 0 <span className="text-base font-normal text-slate-500">/mês</span></div>
                <p className="text-slate-600 mb-6 text-sm">Perfeito para quem está começando.</p>
                <Link href="/sign-up">
                  <Button variant="outline" className="w-full mb-8">Começar Agora</Button>
                </Link>
                <ul className="space-y-3 text-sm">
                  <ListItem check>Página de Perfil Personalizada</ListItem>
                  <ListItem check>Temas Básicos (Claro/Escuro)</ListItem>
                  <ListItem check>Até <strong>2 Links Sociais</strong></ListItem>
                  <ListItem check>Até <strong>3 Produtos</strong></ListItem>
                  <ListItem check>Até <strong>1 Cupom</strong></ListItem>
                  <ListItem check>Até <strong>1 Parceiro</strong></ListItem>
                  <ListItem check={false}>Temas Premium (Degradês)</ListItem>
                  <ListItem check={false}>Remover marca d'água</ListItem>
                </ul>
              </div>

              {/* PRO PLAN */}
              <div className="relative rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-xl scale-105">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Recomendado
                </div>
                <h3 className="text-xl font-bold mb-2">Creator Pro</h3>
                <div className="text-4xl font-extrabold mb-6">R$ 19,90 <span className="text-base font-normal text-slate-500">/mês</span></div>
                <p className="text-slate-600 mb-6 text-sm">Para criadores que querem monetizar de verdade.</p>
                <Link href="/sign-up">
                  <Button className="w-full mb-8 bg-blue-600 hover:bg-blue-700">Assinar Pro</Button>
                </Link>
                <ul className="space-y-3 text-sm">
                  <ListItem check>Links Sociais <strong>Ilimitados</strong></ListItem>
                  <ListItem check>Produtos <strong>Ilimitados</strong></ListItem>
                  <ListItem check>Cupons <strong>Ilimitados</strong></ListItem>
                  <ListItem check>Parceiros <strong>Ilimitados</strong></ListItem>
                  <ListItem check><strong>Temas Premium (Sunset, Ocean...)</strong></ListItem>
                  <ListItem check>Analytics Avançado (Gráficos)</ListItem>
                  <ListItem check><strong>Sem marca d'água</strong></ListItem>
                  <ListItem check>Suporte Prioritário</ListItem>
                </ul>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="py-8 text-center text-sm text-slate-500 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2024 CreatorHub. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-slate-900">Termos</Link>
            <Link href="#" className="hover:text-slate-900">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all">
      <div className="mb-4 p-3 bg-slate-50 rounded-full">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function ListItem({ children, check = true }: { children: React.ReactNode, check?: boolean }) {
  return (
    <li className={`flex items-center gap-3 ${check ? 'text-slate-700' : 'text-slate-400'}`}>
      {check ? (
        <Check className="h-4 w-4 text-green-500 shrink-0" />
      ) : (
        <div className="h-4 w-4 rounded-full border border-slate-200 shrink-0" />
      )}
      <span>{children}</span>
    </li>
  )
}