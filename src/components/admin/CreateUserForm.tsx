
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, UserPlus } from 'lucide-react';

const createUserFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100),
  email: z.string().email({ message: "Invalid email address." }).max(100),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).max(100),
  isAdmin: z.boolean().default(false).optional(),
  isProvider: z.boolean().default(false).optional(), // Added isProvider
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;

interface CreateUserFormProps {
  onSubmit: (data: CreateUserFormValues) => Promise<void>;
  isSubmitting: boolean;
  onFormReset?: () => void; // Optional callback to reset form from parent
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSubmit, isSubmitting, onFormReset }) => {
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      isAdmin: false,
      isProvider: false, // Default value for isProvider
    },
  });

  const handleFormSubmit = async (data: CreateUserFormValues) => {
    await onSubmit(data);
    if (onFormReset && !form.formState.isSubmitting && form.formState.isSubmitSuccessful) {
        form.reset(); // Reset form if submission was successful and callback exists
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isAdmin"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Assign Admin Privileges
                </FormLabel>
                <FormDescription>
                  If checked, this user will have administrative access to the platform.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isProvider"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Assign Provider Role
                </FormLabel>
                <FormDescription>
                  If checked, this user will be registered as a service provider.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating User...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Create User Account
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreateUserForm;
