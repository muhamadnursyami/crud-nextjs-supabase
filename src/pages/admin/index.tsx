import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuGroup, DropdownMenuItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import supabase from "@/lib/db";
import { IMenu } from "@/types/menu";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const AdminPage = () => {
    const [menus, setMenus] = useState<IMenu[]>([]);

    useEffect(()=>{
        const fetchMenu = async () =>{
            const {data, error} = await supabase.from('menus').select('*');
            if(error) console.log(error)
            else setMenus(data);
        }
        fetchMenu();
    },[supabase])
    console.log(menus);
    return (
        <div className="container mx-auto py-8">
            <div className="mb-4 w-full flex justify-between">
                <div className="text-3xl font-bold">
                Menu
                </div>
                    <Button className="font-bold">Add Menu</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-gray-700">Product:</TableHead>
                        <TableHead className="text-gray-700">Price:</TableHead>
                        <TableHead className="text-gray-700">Category:</TableHead>
                        <TableHead className="text-gray-700">Description:</TableHead>
                        <TableHead className="text-gray-700">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {menus.map((menu:IMenu)=>(
                        <TableRow key={menu.id}>
                            <TableCell className="flex items-center gap-2 w-full">
                                <Image width={50} height={50} src={menu.image} alt={menu.name} className="aspect-square object-cover rounded-lg"/>
                                {menu.name}
                            </TableCell>
                            <TableCell>
                                {menu.description.split(' ').slice(0,5).join(' ') +'...' }
                            </TableCell>
                            <TableCell>
                                {menu.category}
                            </TableCell>
                            <TableCell>
                                ${menu.price}.00
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild className="cursor-pointer">
                                        <Ellipsis/>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuLabel className="font-bold mb-1">
                                            Action
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-300">Delete</DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminPage;