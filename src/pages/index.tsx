import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import supabase from "@/lib/db";
import type { IMenu } from "@/types/menu";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Home = () =>{ 
  // menggunakan useState dengan nilai awalnya adalah array 
  // dimana terdapat type yang berupa array juga yang terdapat interfaces IMenu untuk aturan dari
  // isi arraynya tipe data nya
  const [menus, setMenus] = useState<IMenu[]>([]);
  // Fetch api
  useEffect(()=>{
      const fetchMenus = async () => {
        // untuk menselect semua data
        const  {data, error} = await supabase.from('menus').select('*');
      
        if(error) console.log('error: ', error);
        else setMenus(data);
      } 

      fetchMenus();
      // cara banyak use effect ini akan jalan ketika depedencis 
      // useeffect ada yaitu jika supabasenya ada.
  },[supabase]);

  console.log(menus);
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-6xl font-bold mb-5"> Menu</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {menus.map((menu:IMenu)=>(
            <Card key={menu.id}>
                <CardContent>
                  <Image src={menu.image} alt={menu.name} width={200} height={200} className="w-full h-[30vh] object-cover rounded-lg"/>
                  <div className="flex justify-between mt-4">
                    <div>
                      <h4 className="font-semibold text-2xl">{menu.name} </h4>
                      <p>{menu.category}</p>
                    </div>
                    <p className="font-semibold text-2xl">${menu.price}.00</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/menu/${menu.id}`}>
                    <Button className="w-full font-bold">Buy Now</Button>
                  </Link>
                </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
};
export default Home;