import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";


import { UsersService } from "src/users/users.service";

import { Post } from "./post.entity";
import { Repository } from "typeorm";
import { CreatePostDto } from "./dto/create-post.dto";

@Injectable()
export class PostService {

    constructor(
        @InjectRepository(Post) private postRepository: Repository<Post>,
        private userService: UsersService
    ) {}
    
    // title, content, authorId
    async createPost(post: CreatePostDto) {
        const userFound = await this.userService.getUser(post.authorId)

        if (!userFound) {
            return new HttpException('usuario no encontrado', HttpStatus.NOT_FOUND)
        }

        const newPost = this.postRepository.create(post)
        return this.postRepository.save(newPost)
    }

    //get all posts
    getPosts() {
        return this.postRepository.find({
            relations: ['author']
        })
    }
}