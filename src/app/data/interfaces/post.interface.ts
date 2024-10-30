import { Profile } from './profile.interface'

export interface PostCreateDto {
    title: string
    content: string
    authorId: number
  }

export interface CommentCreateDto {
  text: string
  authorId: number
  postId: number
}

export interface Post {
    id: number
    title: string
    communityId: 0
    content: string
    author: Profile
    images: string[]
    createdAt: string
    updatedAt: string
    likes: number
    comments: PostComment[]
  }

export interface PostComment {
    id: number
    text: string
    author: {
      id: 0
      username: string
      avatarUrl: string
      subscribersAmount: number
    }
    postId: number
    commentId: number
    createdAt: string
    updatedAt: string
  }