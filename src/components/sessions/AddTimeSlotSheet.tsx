
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TimeSlotForm from './TimeSlotForm';

interface AddTimeSlotSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}

const AddTimeSlotSheet: React.FC<AddTimeSlotSheetProps> = ({
  isOpen,
  setIsOpen,
  onSuccess,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="bg-mentorpurple hover:bg-mentorpurple/90">
          <Plus className="mr-2 h-4 w-4" /> Add Available Time Slot
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Add New Available Time Slot</SheetTitle>
        </SheetHeader>
        <TimeSlotForm 
          onSuccess={() => {
            setIsOpen(false);
            onSuccess();
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default AddTimeSlotSheet;
