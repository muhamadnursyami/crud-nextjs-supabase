import supabase from "@/lib/db";
import type { IMenu } from "@/types/menu";
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
    <div>
      <div>Home</div>
    </div>
  );
};
export default Home;