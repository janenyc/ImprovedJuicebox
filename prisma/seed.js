const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient();

const createUser = async () => {
    await prisma.user.createMany({
        data: [
            {username: "avenlur", password: "share123"},
            {username: "saglara", password: "share456"},
            {username: "tuesday", password: "share789"},
        ],
    });
};

const createPost = async () => {
// Find each user
const avenlur = 
await prisma.user.findUnique({where: {username: "avenlur"}});

const saglara = 
await prisma.user.findUnique({where: {username: "saglara"}});

const tuesday = 
await prisma.user.findUnique({where: {username: "tuesday"}});


    await prisma.post.createMany({
        data: [
            {
                title: "The story of my life",
                content:
                    "The Story of My Life (1903) chronicles the early years of Helen Keller, a young woman who became both deaf and blind at a young age.",
                userId:  avenlur.id
            },
            {
                title: "The Seven Husbands of Evelyn Hugo",
                content:
                    "Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life. ",
                userId:  avenlur.id
            },

            {
                title: "The Fault in Our Stars",
                content:
                    "Despite the tumor-shrinking medical miracle that has bought her a few years, Hazel has never been anything but terminal, her final chapter inscribed upon diagnosis. ",
                userId:  avenlur.id
            },
            {
                title: "Pride and Prejudice",
                content: "Pride and Prejudice",
                userId: saglara.id
            },
            {
                title: "Lord of the Flies",
                content: "Lord of the Flies",
                userId: saglara.id
            },
            {
                title: "Catching Fire",
                content:
                    "Against all odds, Katniss Everdeen has won the Hunger Games. She and fellow District 12 tribute Peeta Mellark are miraculously still alive.",
                userId: saglara.id
            },
            {
                title: "The Midnight Library",
                content:
                    "Between life and death there is a library, and within that library, the shelves go on forever. ",
                userId:  tuesday.id
            },
            {
                title: "The Perks of Being a Wallflower",
                content:
                    "Despite the tumor-shrinking medical miracle that has bought her a few years, Hazel has never been anything but terminal, her final chapter inscribed upon diagnosis. ",
                userId: tuesday.id
            },
            {
                title: "The Alchemist",
                content: "My sweetest friend everyone I know goes away in the end.",
                userId:  tuesday.id
            },
        ],
    });
};
const main = async () => {
    console.log("SEEDING THE DATABASE");
    await createUser();
    await createPost();
};

main()
.then(async () => {
    await prisma.$disconnect();
})
.catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
