import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuGroup, DropdownMenuItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/lib/db";
import { IMenu } from "@/types/menu";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";


const AdminPage = () => {
    const [menus, setMenus] = useState<IMenu[]>([]);
    const [createDialog, setCreateDialog] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<{
        menu:IMenu;
        action: 'edit' | 'delete';
    } | null>(null);
    useEffect(()=>{
        const fetchMenu = async () =>{
            const {data, error} = await supabase.from('menus').select('*');
            if(error) console.log(error)
            else setMenus(data);
        }
        fetchMenu();
    },[supabase])
   
    // parameter yang di kirim adalah sebuah e yang merupaka type dari FORMEVENT yang di ambil dari react
    const handleSubmit = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        // mengambil semua data form yang dikirim kan dari e current target.
        const formData= new FormData(e.currentTarget);
        
        try {
            // object data dan error ini adalah template dari sana nya untuk supabase jadi ikutin aja
            const {data, error} = await supabase.from('menus').insert(Object.fromEntries(formData)).select();
            
            if(error) console.log('error', error);
            else{
                if(data) {
                // jika ada datanya yang di kembalikan dari hasil insert, maka data tesebut
                // akan di masukan kedalam state menus, agar diperbaharui data sebelumnya dengan data yang baru diinsertkan
                // jadi tidak perlu fetch terus menerus.
                // menus sebelumnya ditambahain dengan data menus terbaru ditampilkan dari supabase
                    setMenus((prev)=> [...prev, ...data]);
                }
                toast('Menu add successfull');
                setCreateDialog(false);
            }
        } catch (error) {
            console.log('error', error);
            
        }
    }


    const handleDeleteMenu = async() =>{
        try {
            const  {data, error} = await supabase.from('menus').delete().eq('id', selectedMenu?.menu.id);
            if(error) console.log(error);
            else{
                setMenus((prev)=> prev.filter((menu) => menu.id !== selectedMenu?.menu.id));
                toast('Menu deleted successfully');
                setSelectedMenu(null);
                console.log(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleEditMenu = async (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newData = Object.fromEntries(formData);
        try {
            const {error} = await supabase.from('menus').update(newData).eq('id', selectedMenu?.menu.id);
            if(error) console.log(error);
            else{
               setMenus((prev)=>
                prev.map((menu) =>
                menu.id === selectedMenu?.menu.id ? {...menu, ...newData} : menu
                ),
            );
            toast('Menu edit successfully')
            setSelectedMenu(null);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-4 w-full flex justify-between">
                <div className="text-3xl font-bold">
                Menu
                </div>
                {/* CREATE */}
                <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                    <DialogTrigger asChild>
                        <Button className="font-bold">Add Menu</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <DialogHeader>
                                <DialogTitle>Add Menu</DialogTitle>
                                <DialogDescription>Create a new manu by insert data in this form</DialogDescription>
                            </DialogHeader>
                            <div className="grid  w-full gap-4">
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" placeholder="Please input your name.." required/>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="price">Price</Label>
                                    <Input id="price" name="price" placeholder="Please input your price.." required/>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="image">Image</Label>
                                    <Input id="image" name="image" placeholder="Please input your image url.." required/>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="category">Category</Label>
                                    <Select name="category" required>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Category"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Category</SelectLabel>
                                                <SelectItem value="Coffee">Coffee</SelectItem>
                                                <SelectItem value="Non Coffee">Non Coffee</SelectItem>
                                                <SelectItem value="Pastries">Pastries</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>    
                                    </Select>
                                </div>
                                  <div className="grid w-full gap-1.5">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea className="resize-none h-32" id="description" name="description" placeholder="Please input your description.." required/>
                                </div>
                            </div>
                        <DialogFooter>
                            <DialogClose>
                                <Button type="button" variant={'secondary'} className="cursor-pointer"> Cancel</Button>
                            </DialogClose>
                            <Button type="submit">
                                Create
                            </Button>
                        </DialogFooter>
                        </form>
                        
                    </DialogContent>
                </Dialog>
            </div>
            {/* SHOW DATA */}
            <div>
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
                                                <DropdownMenuItem onClick={()=> setSelectedMenu({menu, action:'edit'})}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={()=> setSelectedMenu({menu, action:'delete'})} className="text-red-300">Delete</DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {/* DELETE */}
            <Dialog open={selectedMenu !== null && selectedMenu.action === 'delete'} onOpenChange={(open)=>{
                if (!open) {
                    setSelectedMenu(null);
                }
            }}>
                    <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Delete menu</DialogTitle>
                                <DialogDescription>Are you sure want to delete {selectedMenu?.menu.image}</DialogDescription>
                            </DialogHeader>
                        <DialogFooter>
                            <DialogClose>
                                <Button variant={'secondary'} className="cursor-pointer"> Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleDeleteMenu} variant={'destructive'} className="cursor-pointer">
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
            </Dialog>
            {/* EDIT */}
           <Dialog open={selectedMenu !== null && selectedMenu.action === 'edit'} onOpenChange={(open)=>{
                if (!open) {
                    setSelectedMenu(null);
                }
            }}>
                    
                    <DialogContent className="sm:max-w-md">
                        <form onSubmit={handleEditMenu} className="space-y-4">
                            <DialogHeader>
                                <DialogTitle>Edit Menu</DialogTitle>
                                <DialogDescription>Edit Your data menu</DialogDescription>
                            </DialogHeader>
                            <div className="grid  w-full gap-4">
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" defaultValue={selectedMenu?.menu.name} name="name" placeholder="Please input your name.." required/>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="price">Price</Label>
                                    <Input id="price" defaultValue={selectedMenu?.menu.price} name="price" placeholder="Please input your price.." required/>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="image">Image</Label>
                                    <Input id="image" defaultValue={selectedMenu?.menu.image} name="image" placeholder="Please input your image url.." required/>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="category">Category</Label>
                                    <Select name="category" required defaultValue={selectedMenu?.menu.category}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Category"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Category</SelectLabel>
                                                <SelectItem value="Coffee">Coffee</SelectItem>
                                                <SelectItem value="Non Coffee">Non Coffee</SelectItem>
                                                <SelectItem value="Pastries">Pastries</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>    
                                    </Select>
                                </div>
                                  <div className="grid w-full gap-1.5">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea defaultValue={selectedMenu?.menu.description} className="resize-none h-32" id="description" name="description" placeholder="Please input your description.." required/>
                                </div>
                            </div>
                        <DialogFooter>
                            <DialogClose>
                                <Button type="button" variant={'secondary'} className="cursor-pointer"> Cancel</Button>
                            </DialogClose>
                            <Button type="submit">
                                Edit
                            </Button>
                        </DialogFooter>
                        </form>
                        
                    </DialogContent>
                </Dialog>
        </div>
    )
}

export default AdminPage;