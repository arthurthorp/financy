import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { TrashIcon, SquarePenIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EntityActionsProps {
  onDelete?: () => Promise<void> | void;

  editContent?: React.ReactNode;
  editTitle?: string;
  editDescription?: string;

  openEdit: boolean;
  setOpenEdit: (open: boolean) => void;

  deleteTitle?: string;
  deleteDescription?: string;

  className?: string;
}

export function EntityActions({
  onDelete,
  editContent,
  editTitle = "Editar",
  editDescription = "Você tem certeza que deseja editar?",
  openEdit,
  setOpenEdit,
  deleteTitle = "Tem certeza?",
  deleteDescription = "Essa ação não pode ser desfeita.",
  className,
}: EntityActionsProps) {
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;

    try {
      setLoadingDelete(true);
      await onDelete();
      setOpenDelete(false);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <div className={cn("flex gap-2", className)}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenDelete(true)}
        >
          <TrashIcon className="w-4 h-4 text-destructive" />
        </Button>

        <Button variant="outline" size="icon" onClick={() => setOpenEdit(true)}>
          <SquarePenIcon className="w-4 h-4" />
        </Button>
      </div>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>{deleteDescription}</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel disabled={loadingDelete}>
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={loadingDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {loadingDelete ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={openEdit}
        onOpenChange={(open) => {
          if (!open) setOpenEdit(false);
        }}
      >
        {openEdit && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editTitle}</DialogTitle>
              <DialogDescription>{editDescription}</DialogDescription>
            </DialogHeader>

            {editContent}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
