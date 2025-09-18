
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { getCompanyInternships, updateInternship, deleteInternship } from "@/services/companyService";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

type Internship = {
    id: string;
    title: string;
    requiredSkills: string[];
    location: string;
    stipend: string;
    capacity: number;
    companyId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Role is required"),
  requiredSkills: z.string().min(1, "Skills are required"),
  location: z.string().min(1, "Location is required"),
  stipend: z.string().min(1, "Stipend is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
});

export default function ManageInternshipsPage() {
  const { toast } = useToast();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      requiredSkills: "",
      location: "",
      stipend: "",
      capacity: 1,
    },
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    if (selectedInternship) {
      form.reset({
        title: selectedInternship.title,
        requiredSkills: selectedInternship.requiredSkills.join(', '),
        location: selectedInternship.location,
        stipend: selectedInternship.stipend,
        capacity: selectedInternship.capacity,
      });
    } else {
      form.reset();
    }
  }, [selectedInternship, form]);

  async function fetchInternships() {
    setIsLoading(true);
    try {
      const data = await getCompanyInternships();
      setInternships(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load internships.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdate(values: z.infer<typeof formSchema>) {
    if (!selectedInternship) return;
    try {
      const internshipData = {
          ...values,
          requiredSkills: values.requiredSkills.split(',').map(skill => skill.trim())
      };
      await updateInternship(selectedInternship.id, internshipData);
      toast({
        title: "Internship Updated!",
        description: "The internship details have been saved.",
      });
      fetchInternships(); // Re-fetch to show updated data
      setIsDialogOpen(false);
      setSelectedInternship(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update internship. Please try again.",
      });
    }
  }

  async function handleDelete(internshipId: string) {
    try {
        await deleteInternship(internshipId);
        toast({
            title: "Internship Deleted",
            description: "The internship posting has been removed.",
        });
        fetchInternships(); // Re-fetch to show updated data
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete internship.",
        });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold font-headline">Manage Internships</h1>
            <p className="text-muted-foreground">
            View, edit, or delete your current internship postings.
            </p>
        </div>
        <Button asChild>
            <Link href="/dashboard/company/post-internship">
                <PlusCircle className="mr-2 h-4 w-4" />
                Post New Internship
            </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Active Postings</CardTitle>
          <CardDescription>A list of all internships your company has posted.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Stipend</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? Array.from({length: 3}).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    )) : internships.map((internship) => (
                        <TableRow key={internship.id}>
                            <TableCell className="font-medium">{internship.title}</TableCell>
                            <TableCell>{internship.location}</TableCell>
                            <TableCell>{internship.capacity}</TableCell>
                            <TableCell>{internship.stipend}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => { setSelectedInternship(internship); setIsDialogOpen(true); }}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" className="w-full justify-start text-sm text-red-600 hover:text-red-600 font-normal relative select-none items-center rounded-sm px-2 py-1.5 outline-none transition-colors hover:bg-red-100/50">
                                                     <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the
                                                    internship posting.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(internship.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setSelectedInternship(null); }}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Edit Internship</DialogTitle>
                <DialogDescription>Update the details for your internship posting.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Internship Role / Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requiredSkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Skills (comma-separated)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <div className="grid grid-cols-3 gap-4">
                     <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stipend"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Stipend</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Capacity</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
