export interface Post{
    title: string | null,
    body: string | null,
    votes: number,
    voters: object,
    id?: string | null,
    postedTime: any,
    authorDisplayName: string,
    authorUid: string,
    approved: boolean | null
}