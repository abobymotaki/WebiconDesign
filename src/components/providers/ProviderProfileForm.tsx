
"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { DocumentData } from 'firebase/firestore';

export const providerProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100),
  role: z.string().min(2, "Role must be at least 2 characters.").max(100).optional().or(z.literal('')),
  bio: z.string().max(1000, "Bio can be up to 1000 characters.").optional().or(z.literal('')),
  skills: z.string().max(500, "Skills can be up to 500 characters.").optional().or(z.literal('')), // Comma-separated
  rate: z.string().max(50, "Rate can be up to 50 characters.").optional().or(z.literal('')), // e.g., $70/hr
  location: z.string().max(100, "Location can be up to 100 characters.").optional().or(z.literal('')),
  status: z.enum(["Available", "Busy", "Away", ""]).optional().or(z.literal('')),
  githubLink: z.string().url({ message: "Please enter a valid URL for GitHub." }).max(200).optional().or(z.literal('')),
  linkedinLink: z.string().url({ message: "Please enter a valid URL for LinkedIn." }).max(200).optional().or(z.literal('')),
  avatarUrl: z.string().url({ message: "Please enter a valid URL for avatar." }).max(300).optional().or(z.literal('')),
  dataAiHint: z.string().max(50, "AI hint can be up to 50 characters.").optional().or(z.literal('')),
  projectsSummary: z.string().max(2000, "Projects summary can be up to 2000 characters.").optional().or(z.literal('')),
});

export type ProviderProfileFormValues = z.infer<typeof providerProfileSchema>;

interface ProviderProfileFormProps {
  currentUser: User | null;
  currentProfileData: DocumentData | null;
  onSubmit: (data: ProviderProfileFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const ProviderProfileForm: React.FC<ProviderProfileFormProps> = ({ currentUser, currentProfileData, onSubmit, isSubmitting }) => {
  const form = useForm<ProviderProfileFormValues>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: {
      name: currentProfileData?.name || currentUser?.displayName || '',
      role: currentProfileData?.role || '',
      bio: currentProfileData?.bio || '',
      skills: Array.isArray(currentProfileData?.skills) ? currentProfileData.skills.join(', ') : (currentProfileData?.skills || ''),
      rate: currentProfileData?.rate || '',
      location: currentProfileData?.location || '',
      status: currentProfileData?.status || '',
      githubLink: currentProfileData?.githubLink || '',
      linkedinLink: currentProfileData?.linkedinLink || '',
      avatarUrl: currentProfileData?.avatarUrl || 'https://placehold.co/150x150.png',
      dataAiHint: currentProfileData?.dataAiHint || 'person portrait',
      projectsSummary: currentProfileData?.projectsSummary || '',
    },
  });

  useEffect(() => {
    if (currentProfileData) {
      form.reset({
        name: currentProfileData.name || currentUser?.displayName || '',
        role: currentProfileData.role || '',
        bio: currentProfileData.bio || '',
        skills: Array.isArray(currentProfileData.skills) ? currentProfileData.skills.join(', ') : (currentProfileData?.skills || ''),
        rate: currentProfileData.rate || '',
        location: currentProfileData.location || '',
        status: currentProfileData.status || '',
        githubLink: currentProfileData.githubLink || '',
        linkedinLink: currentProfileData.linkedinLink || '',
        avatarUrl: currentProfileData.avatarUrl || 'https://placehold.co/150x150.png',
        dataAiHint: currentProfileData.dataAiHint || 'person portrait',
        projectsSummary: currentProfileData.projectsSummary || '',
      });
    }
  }, [currentProfileData, form, currentUser]);

  const handleFormSubmit = async (data: ProviderProfileFormValues) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormDescription>This will be displayed publicly.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role / Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Senior Web Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us a little about yourself and your expertise." rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <Input placeholder="e.g., React, Node.js, UI Design" {...field} />
              </FormControl>
              <FormDescription>Enter skills separated by commas.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Hourly Rate</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., $75/hr or Project-based" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., New York, USA or Remote" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your availability" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Busy">Busy</SelectItem>
                  <SelectItem value="Away">Away</SelectItem>
                  <SelectItem value="">Not Set</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="githubLink"
            render={({ field }) => (
                <FormItem>
                <FormLabel>GitHub Profile URL</FormLabel>
                <FormControl>
                    <Input type="url" placeholder="https://github.com/yourusername" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="linkedinLink"
            render={({ field }) => (
                <FormItem>
                <FormLabel>LinkedIn Profile URL</FormLabel>
                <FormControl>
                    <Input type="url" placeholder="https://linkedin.com/in/yourusername" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Avatar Image URL</FormLabel>
                <FormControl>
                    <Input type="url" placeholder="https://placehold.co/150x150.png" {...field} />
                </FormControl>
                 <FormDescription>URL to your profile picture.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="dataAiHint"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Avatar AI Hint</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. person portrait" {...field} />
                </FormControl>
                <FormDescription>Keywords for AI image search (max 2 words).</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
          control={form.control}
          name="projectsSummary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Projects Summary</FormLabel>
              <FormControl>
                <Textarea placeholder="Briefly describe some of your key projects or accomplishments." rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Profile...
            </>
          ) : (
            'Save Profile Changes'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProviderProfileForm;
