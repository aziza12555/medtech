export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: "male" | "female";
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDoctorDto {
  firstName: string;
  lastName: string;
  specialization: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: "male" | "female";
  address?: string;
}

export interface UpdateDoctorDto extends Partial<CreateDoctorDto> {}
