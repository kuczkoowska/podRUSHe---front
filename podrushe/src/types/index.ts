export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface Package {
    id: number;
    title: string;
    description: string;
    destination: string;
    price: number;
    startDate: Date;
    endDate: Date;
    imageUrl?: string;
    included?: string[];
    excluded?: string[];
}

export interface Booking {
    id: number;
    userId: number;
    packageId: number;
    bookingDate: Date;
    totalPrice: number;
    numberOfTravelers: number;
    package?: Package;
}

export interface Comment {
    id: number;
    content: string;
    user: User;
    packageId: number;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}