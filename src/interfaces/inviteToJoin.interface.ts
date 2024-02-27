export interface IInviteToJoin {
    _id?: string;
    from?: string;
    to: string;
    workflow: string;
    isDeleted?: number;
}

export interface IInviteToJoinObject {
    [_id: string]: IInviteToJoin;
}