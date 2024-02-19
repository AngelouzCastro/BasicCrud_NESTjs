import { Controller, Get, Post, Body} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostController {
    constructor (private postService: PostService) {}

    @Post()
    createPost(@Body() post: CreatePostDto) {
        return this.postService.createPost(post);
    }

    @Get()
    getPosts() {
        return this.postService.getPosts();
    }
}
