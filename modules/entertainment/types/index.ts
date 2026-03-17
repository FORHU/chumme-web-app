export type ModalType =
  | "create-category"
  | "edit-category"
  | "create-subcategory"
  | "edit-subcategory"
  | "add-topic"
  | "edit-topic"
  | "delete-confirm"
  | null;

export interface ModalData {
  type: ModalType;
  item?: {
    id: string;
    name: string;
    itemType?: "category" | "subcategory" | "topic";
    [key: string]: unknown;
  };
}
