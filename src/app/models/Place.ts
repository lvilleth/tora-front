class Place {

    constructor(
        public id:string,
        public name:string,
        public active:boolean,
        public visitDuration:number,
        public geo:Geo,
        public category:string
    ){}

    isOpen(){
        return this.active;
    }

    equals(other:Place):boolean{
        return other ? other.id === this.id : false;
    }

}

class Geo {
    constructor(
        public lat:number,
        public long:number
    ){}
}

export { Place, Geo };