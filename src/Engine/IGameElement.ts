export interface IGameElement 
{
    Update(dTime:number): void;
    get X():number;
    set X(value:number);
    get Y():number;
    set Y(value:number);
}