const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const router = require("express").Router();

//Get and return all the posts 
router.get("/", async (req, res) => {
    const posts = await prisma.post.findMany();

    res.send(posts);
});

//Gets and return a specified post
router.get("/:id", async (req, res) => {
    const singlePostId = parseInt(req.params.id);
    const singlePost = await prisma.post.findUnique({
        where: {id: singlePostId},
    });

    res.send(singlePost || {});
});

//Create a new post in db
//ROUTE "/api/posts/"
router.post("/", async(req,res)=>{
    const newPost = req.body
    
    if(!req.user){
        res.sendStatus(401)
    }
    else{
        try{
            const result = await prisma.post.create({data: {...newPost, userId: req.user.id}})
            res.send(result)
        }
        catch(err){
            res.status(500).send(err)
        }
    }
})

//Change the post in db
router.patch("/:id", async (req,res)=>{
    const postId = parseInt(req.params.id)
    const updates = req.body

    // Unauthorized if no user is login
    if (!req.user) {
        return res.sendStatus(401); 
    }
    try {
        const existingPost = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!existingPost) {
            return res.status(404).send('Post not found');
        }

        // Only the owner of the post can update it
        if (existingPost.userId !== req.user.id) {
            return res.status(403).send('Unauthorized to update this post');
        }

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: updates
        });

        res.send(updatedPost);
    } catch (err) {
        res.status(500).send('Failed to update post');
    }

})

// Delete a post in db
router.delete("/:id", async (req, res) => {
    const postId = parseInt(req.params.id);
    
     // Unauthorized if no user is login
    if (!req.user) {
        return res.sendStatus(401); 
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            return res.status(404).send("Post not found.");
        }

        // Check if the user is the author of the post
        if (post.userId !== req.user.id) {
            return res.status(403).send("You do not have permission to delete this post.");
        }

        await prisma.post.delete({
            where: { id: postId }
        });

        res.send("Post deleted successfully.");
    } catch (err) {
        console.error('Error deleting a post: ', err);
        res.status(500).send("An error occurred while deleting the post.");
    }
});


module.exports = router;