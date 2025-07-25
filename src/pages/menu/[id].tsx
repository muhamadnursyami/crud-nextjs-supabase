import supabase from "@/lib/db";
import { IMenu } from "@/types/menu";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DetailMenu = () => {
    const router = useRouter();
    const [menu, setMenu] = useState<IMenu | null>(null);
    useEffect(() =>{
        if(router.query.id) {
            const fetchMenuDetail = async () =>{
                // cara bacanya, ngambil data dari supabase di table menu, ambil nama dan description saja, berdasarkan id
                // dan tampilankan hasilnya object, kalo tidak pakai singgle maka hasil apinya itu array.
                const {data, error} = await supabase.from('menus').select('*').eq('id', router.query.id).single();
                
                if(error) console.log(error);
                else setMenu(data);
            }
            fetchMenuDetail();
        } 
    },[router.query.id] )




    return (
        <div className="container mx-auto py-8">
            <div className="flex gap 16">
                {
                    menu && (
                        <div className="flex gap-16 items-center w-full">
                            <div className="w-1/2">
                                <Image src={menu.image} alt={menu.name} width={1080} height={1080} className="w-full h-[70vh] object-cover rounded-2xl"/>
                            </div>
                            <div className="w-1/2">
                                <h1 className="text-5xl font-bold">{menu.name}</h1>
                                <p >{menu.description}</p>
                                    <div className="flex gap-4 items-center">
                                        <p>{menu.price}</p>
                                        <p>{menu.category}</p>
                                    </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default DetailMenu;