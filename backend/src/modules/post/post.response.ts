export interface PostListItem{
    id: string,
    title: string,
    description: string,
    imageUrl: string | null,
    createdAt: Date,
    updatedAt: Date,
    userId: string
}