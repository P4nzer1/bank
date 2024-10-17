export interface StepParam {
    name: string;          
    identifier: string;      
    type: 'multiple' | 'text'; 
    values?: string[];       
    required: boolean;       
  }