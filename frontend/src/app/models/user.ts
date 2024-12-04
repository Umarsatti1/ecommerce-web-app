import { Cart } from "./cart";

export interface User {
    email: string;
    token: string;
    cart?: Cart;
    roles?: string[];
    firstName?: string;  // Add firstName
    lastName?: string;   // Add lastName
}