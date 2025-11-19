import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.coupon.deleteMany()
  await prisma.product.deleteMany()
  await prisma.partner.deleteMany()
  await prisma.socialLinks.deleteMany()
  await prisma.user.deleteMany()

  const user = await prisma.user.create({
    data: {
      id: "clerk_user_id_mock_1",
      email: 'demo@creatorhub.com',
      username: 'luisrun', // Será acessado via localhost:3000/luisrun
      name: 'Luís Runner',
      bio: 'Compartilhando minha jornada de 365 dias de corrida. Fé e persistência! 🏃‍♂️🔥',
      avatarUrl: 'https://github.com/shadcn.png', 
      themeColor: '#f97316', 
      
      // 3. Redes Sociais
      socialLinks: {
        create: {
          instagram: 'https://instagram.com',
          showInsta: true,
          strava: 'https://strava.com', 
          showStrava: true,
          youtube: 'https://youtube.com',
          showYoutube: true,
          tiktok: 'https://tiktok.com',
          showTiktok: false 
        }
      },

      // 4. Produtos (Afiliados)
      products: {
        create: [
          {
            title: 'Tênis de Corrida Ultra 2',
            description: 'O melhor amortecimento para longas distâncias.',
            affiliateUrl: 'https://amazon.com/tenis',
            imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
            price: 'R$ 599,90'
          },
          {
            title: 'Garmin Forerunner',
            description: 'GPS preciso para seus treinos.',
            affiliateUrl: 'https://amazon.com/garmin',
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
            price: 'R$ 1.299,00'
          }
        ]
      },

      // 5. Cupons
      coupons: {
        create: [
          {
            storeName: 'Centauro',
            code: 'LUIS10',
            discount: '10% OFF',
            link: 'https://centauro.com.br'
          },
          {
            storeName: 'Insider Store',
            code: 'TECHRUN',
            discount: '15% OFF',
            link: 'https://insiderstore.com.br'
          }
        ]
      }
    }
  })

  console.log(`Usuário criado com sucesso: ${user.username}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })    