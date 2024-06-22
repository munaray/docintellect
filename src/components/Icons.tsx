import { LucideProps, User } from "lucide-react";

export const Icons = {
    user: User,
    logo: (props: LucideProps) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M3.292 20.71a1 1 0 0 1 0-1.411l2.829-2.828a8.044 8.044 0 0 1 1.91-9.431C13.075 2 20.9 3.1 20.9 3.1a18.67 18.67 0 0 1-.142 4.928h-4.784l3.751 3.751a12.8 12.8 0 0 1-2.763 4.192 8.045 8.045 0 0 1-9.43 1.911L4.7 20.71a1 1 0 0 1-1.408 0z" />
        </svg>

    )
}