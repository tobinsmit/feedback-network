export interface Post{
    title: string | null,
    body: string | null,
    votes: number,
    voters: object,
    id?: string | null, // null for post preview
    postedTime: any,
    authorDisplayName: string,
    authorUid: string,
    approved: true | false | null,
    deleted?: true
}