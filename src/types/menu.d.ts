// membuat interface dengan nama IMenu, atau bebas apa, dengan attribute sesuai pada tabel dan id yang ingin ditampilkan 
interface IMenu {
    id:number;
    name : string;
    description : string;
    price: number;
    category: string;
    image: string;
}
// export agar jadi global variabel
export type { IMenu};