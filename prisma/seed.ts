import { PrismaClient } from '@prisma/client'
import shirtData from './shirts.json'
const prisma = new PrismaClient();

async function main() {

    for (let i = 0; i < shirtData.length; i++) {
        const shirt = shirtData[i] as { description: string, price: number, url: string, gender: string };
        await prisma.shirt.upsert({
            where: { url: shirt.url },
            update: {},
            create: {
                description: shirt.description,
                price: shirt.price,
                url: shirt.url,
                gender: shirt.gender,
            }
        });
    }
}

main().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})
