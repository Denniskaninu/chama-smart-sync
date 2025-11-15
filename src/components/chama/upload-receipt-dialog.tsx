
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, Upload } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import Image from 'next/image';

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


export function UploadReceiptDialog({ groupId, children }: { groupId: string; children: React.ReactNode }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const dataUrl = await fileToDataUrl(selectedFile);
      setPreview(dataUrl);
    } else {
        setFile(null);
        setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!firestore || !user || !file || !preview) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please select a file to upload.',
      });
      return;
    }
    setLoading(true);

    const receiptData = {
      groupId: groupId,
      url: preview, // Store the data URL directly
      uploadedBy: user.uid,
      timestamp: new Date().toISOString(),
      fileName: file.name,
      createdAt: serverTimestamp(),
    };

    const receiptsCollection = collection(firestore, 'receipts');
    addDoc(receiptsCollection, receiptData)
      .then(() => {
        toast({
          title: 'Receipt Uploaded!',
          description: `The receipt "${file.name}" has been successfully uploaded.`,
        });
        setOpen(false);
        setFile(null);
        setPreview(null);
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: 'receipts',
          operation: 'create',
          requestResourceData: receiptData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: 'destructive',
          title: 'Error Uploading Receipt',
          description: 'Could not upload the receipt. Please check permissions.',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload a New Receipt</DialogTitle>
          <DialogDescription>
            Select an image file as proof of payment. This will be visible to all group members.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Receipt Image</Label>
            <Input id="picture" type="file" onChange={handleFileChange} accept="image/*" />
             {preview && (
                <div className="mt-4 relative w-full aspect-[2/3] rounded-md overflow-hidden border">
                    <Image src={preview} alt="Receipt preview" fill objectFit="contain" />
                </div>
             )}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleUpload}
            disabled={loading || !file}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
