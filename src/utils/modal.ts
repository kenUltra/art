export interface iModal {
  title: string;
  headTitle: string;
  subtitle?: string;
  content?: string;
  hasControl: boolean;
}
export interface iModalInput {
  title?: string;
  value: string;
  placeholder: string;
  name: string;
  id: string;
}
