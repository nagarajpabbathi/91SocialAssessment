export interface appointmentForm {
  name?: string;
  datetime?: string | number;
  endDateTime?: string | number;
}

export interface appointmentType extends appointmentForm {
  date: string;
  endTime: string;
  time: string;
  id?: number;
}

export type collideAppointmentType = {
  index?: number ;
  data?: appointmentType ;
};
