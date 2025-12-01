import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageCircle, HelpCircle, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SupportPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Suporte e Ajuda</h2>
        <p className="text-sm text-muted-foreground">
          Tire suas dúvidas ou entre em contato com nosso time.
        </p>
      </div>
      
      <Separator />

      {/* CANAIS DE ATENDIMENTO */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-blue-100 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </CardTitle>
            <CardDescription>
              Atendimento mais rápido para assinantes Pro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Troque o número abaixo pelo seu ou do suporte */}
            <a 
              href="https://wa.me/5511999999999?text=Olá,%20preciso%20de%20ajuda%20com%20o%20CreatorHub" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Iniciar Conversa
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              E-mail
            </CardTitle>
            <CardDescription>
              Para questões financeiras ou parcerias.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="mailto:suporte@creatorhub.com">
              <Button variant="outline" className="w-full">
                Enviar E-mail
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* FAQ - PERGUNTAS FREQUENTES */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Dúvidas Frequentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            
            <AccordionItem value="item-1">
              <AccordionTrigger>Como cancelo minha assinatura?</AccordionTrigger>
              <AccordionContent>
                Você pode cancelar a qualquer momento indo em <strong>Configurações</strong> e clicando em "Gerenciar Assinatura". O acesso Pro continuará ativo até o fim do período já pago.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Como recebo pelas vendas dos produtos?</AccordionTrigger>
              <AccordionContent>
                O CreatorHub funciona como uma vitrine. Os links de afiliado são seus (Amazon, Hotmart, Shopee). O pagamento é feito diretamente por essas plataformas na sua conta de afiliado, nós não intermediamos essa parte.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Posso mudar meu nome de usuário?</AccordionTrigger>
              <AccordionContent>
                Atualmente o nome de usuário é fixo para garantir a integridade dos links. Se precisar muito mudar, entre em contato com o suporte via e-mail.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>O que acontece se eu voltar para o plano Grátis?</AccordionTrigger>
              <AccordionContent>
                Seus produtos e cupons extras não serão apagados, mas ficarão ocultos na sua página pública, respeitando o limite de 3 itens do plano Grátis. Ao assinar novamente, tudo volta a aparecer.
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground pt-8">
        <p>CreatorHub v1.0.0 • Feito por LA Tech Solutions</p>
        <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="hover:underline">Termos de Uso</a>
            <a href="#" className="hover:underline">Política de Privacidade</a>
        </div>
      </div>

    </div>
  );
}