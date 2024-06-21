export interface LeadsModel {
  _id:string
  profileImg: string;
  lastName: string;
  leadSource: string;
  tradingExperience: string;
  phone: string;
  status: string;
  created_at: string;
  // tags: Array<{}>;
  isSelected?:any;
}
